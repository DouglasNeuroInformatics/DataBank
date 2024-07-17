import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { ColumnType, PermissionLevel } from '@prisma/client';
import type { PrismaClient } from '@prisma/client/extension';

import { InjectModel, InjectPrismaClient } from '@/core/decorators/inject-prisma-client.decorator';
import type { Model } from '@/prisma/prisma.types';
import type { GetColumnViewDto } from '@/projects/zod/projects';
import { type Series, pl } from '@/vendor/nodejs-polars.js';

import type { UpdateTabularColumnDto } from './zod/columns';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel('TabularColumn') private readonly columnModel: Model<'TabularColumn'>,
    @InjectPrismaClient() private readonly prisma: PrismaClient
  ) {}

  async changeColumnDataPermission(columnId: string, permissionLevel: PermissionLevel) {
    return await this.columnModel.update({
      data: {
        dataPermission: permissionLevel
      },
      where: {
        id: columnId
      }
    });
  }

  async changeColumnMetadataPermission(columnId: string, permissionLevel: PermissionLevel) {
    return await this.columnModel.update({
      data: {
        summaryPermission: permissionLevel
      },
      where: {
        id: columnId
      }
    });
  }

  async createFromSeries(tabularDataId: string, colSeries: Series) {
    const dataArray = colSeries.toArray().map((x) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { value: x };
    });

    if (colSeries.isFloat()) {
      const floatSummary = this.calculateSummaryOnSeries('FLOAT', colSeries);
      if (!floatSummary.floatSummary) {
        throw new NotFoundException('Float summary NOT FOUND!');
      }

      await this.columnModel.create({
        data: {
          dataPermission: 'MANAGER',
          floatData: dataArray,
          kind: 'FLOAT',
          name: colSeries.name,
          nullable: colSeries.nullCount() != 0,
          // numericColumnValidation: {
          //   max: col.max(),
          //   min: col.min()
          // },
          summary: {
            count: colSeries.len() - colSeries.nullCount(),
            floatSummary: floatSummary.floatSummary,
            nullCount: colSeries.nullCount()
          },
          summaryPermission: 'MANAGER',
          tabularDataId: tabularDataId
        }
      });
    } // create an int column
    else if (colSeries.isNumeric()) {
      const intSummary = this.calculateSummaryOnSeries('INT', colSeries);
      if (!intSummary?.intSummary) {
        throw new NotFoundException('Int summary NOT FOUND!');
      }
      await this.columnModel.create({
        data: {
          dataPermission: 'MANAGER',
          intData: dataArray,
          kind: 'INT',
          name: colSeries.name,
          nullable: colSeries.nullCount() != 0,
          // numericColumnValidation: {
          //   max: col.max(),
          //   min: col.min()
          // },
          summary: {
            count: colSeries.len() - colSeries.nullCount(),
            intSummary: intSummary.intSummary,
            nullCount: colSeries.nullCount()
          },
          summaryPermission: 'MANAGER',
          tabularDataId: tabularDataId
        }
      });
    }

    // create a boolean column
    if (colSeries.isBoolean()) {
      const enumSummary = this.calculateSummaryOnSeries('BOOLEAN', colSeries);
      if (!enumSummary?.enumSummary) {
        throw new NotFoundException('Enum summary NOT FOUND!');
      }
      await this.columnModel.create({
        data: {
          booleanData: dataArray,
          dataPermission: 'MANAGER',
          kind: 'BOOLEAN',
          name: colSeries.name,
          nullable: colSeries.nullCount() != 0,
          // numericColumnValidation: {
          //   max: col.max(),
          //   min: col.min()
          // },
          summary: {
            count: colSeries.len() - colSeries.nullCount(),
            enumSummary: enumSummary.enumSummary,
            nullCount: colSeries.nullCount()
          },
          summaryPermission: 'MANAGER',
          tabularDataId: tabularDataId
        }
      });
    }

    // create a datetime column
    if (colSeries.isDateTime()) {
      const datetimeSummary = this.calculateSummaryOnSeries('DATETIME', colSeries);
      if (!datetimeSummary?.datetimeSummary) {
        throw new NotFoundException('Datetime summary NOT FOUND!');
      }
      await this.columnModel.create({
        data: {
          dataPermission: 'MANAGER',
          datetimeData: dataArray,
          kind: 'DATETIME',
          name: colSeries.name,
          nullable: colSeries.nullCount() != 0,
          // numericColumnValidation: {
          //   max: col.max(),
          //   min: col.min()
          // },
          summary: {
            count: colSeries.len() - colSeries.nullCount(),
            datetimeSummary: datetimeSummary.datetimeSummary,
            nullCount: colSeries.nullCount()
          },
          summaryPermission: 'MANAGER',
          tabularDataId: tabularDataId
        }
      });
    }

    // create a string column
    if (colSeries.isString()) {
      await this.columnModel.create({
        data: {
          dataPermission: 'MANAGER',
          kind: 'STRING',
          name: colSeries.name,
          nullable: colSeries.nullCount() != 0,
          stringData: dataArray,
          // numericColumnValidation: {
          //   max: col.max(),
          //   min: col.min()
          // },
          summary: {
            count: colSeries.len() - colSeries.nullCount(),
            nullCount: colSeries.nullCount()
          },
          summaryPermission: 'MANAGER',
          tabularDataId: tabularDataId
        }
      });
    }
  }

  async deleteById(columnId: string) {
    return await this.columnModel.delete({
      where: {
        id: columnId
      }
    });
  }

  deleteByTabularDataId(tabularDataId: string) {
    return this.columnModel.deleteMany({
      where: {
        tabularDataId
      }
    });
  }

  async getById(columnId: string) {
    const column = await this.columnModel.findUnique({
      where: {
        id: columnId
      }
    });

    if (!column) {
      throw new NotFoundException();
    }
    return column;
  }

  async getColumnView(getColumnViewDto: GetColumnViewDto) {
    const columnView = await this.getById(getColumnViewDto.columnId);

    // store column data in a polars series according to the type
    const currSeries = await this.columnIdToSeries(getColumnViewDto.columnId);

    // check if there is a row max bound
    if (getColumnViewDto.rowMax) {
      currSeries.slice(getColumnViewDto.rowMin, getColumnViewDto.rowMax - getColumnViewDto.rowMin);
    } else {
      currSeries.slice(getColumnViewDto.rowMin);
    }

    // check for hash, do the hashing
    if (getColumnViewDto.hash) {
      // do the hashing, will result in a UInt64 series
      currSeries.hash();
      // cast into a string series
      currSeries.cast(pl.String);
      // if(getColumnViewDto.hash.length) {series.str.slice(0, length)}
    } else if (getColumnViewDto.trim && columnView.kind === 'STRING') {
      // trim the string in each cell of a string column (should trim columns of other data types)
      // the slice function takes two parameters: offset and length (optional)
      currSeries.str.slice(
        getColumnViewDto.trim.start ?? 0,
        getColumnViewDto.trim.end ? getColumnViewDto.trim.end - (getColumnViewDto.trim.start ?? 0) : undefined
      );
    }
    // recalculate the summary for the column
    columnView.summary = this.calculateSummaryOnSeries(columnView.kind, currSeries);

    return columnView;
  }

  async getLengthById(columnId: string) {
    const col = await this.columnModel.findUnique({
      where: {
        id: columnId
      }
    });
    if (col?.booleanData) {
      return col.booleanData.length;
    }
    if (col?.stringData) {
      return col.stringData.length;
    }
    if (col?.intData) {
      return col.intData.length;
    }
    if (col?.floatData) {
      return col.floatData.length;
    }
    if (col?.datetimeData) {
      return col.datetimeData.length;
    }
    if (col?.enumData) {
      return col.enumData.length;
    }
    return 0;
  }

  async mutateColumnType(columnId: string, colType: ColumnType) {
    const col = await this.getById(columnId);
    if (col.kind === colType) {
      throw new ConflictException(
        'Cannot change column type! Input column type is the same as the current column type!'
      );
    }
    // we need to know current column datatype
    // get the corresponding data value array and store it as a polars series
    let data;
    let removeFromCol;
    switch (col.kind) {
      case 'BOOLEAN':
        data = pl.Series(col.booleanData);
        removeFromCol = this.columnModel.update({
          data: {
            booleanData: undefined,
            enumColumnValidation: undefined,
            summary: {
              enumSummary: undefined
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      case 'STRING':
        data = pl.Series(col.stringData);
        removeFromCol = this.columnModel.update({
          data: {
            stringColumnValidation: undefined,
            stringData: undefined
          },
          where: {
            id: col.id
          }
        });
        break;
      case 'INT':
        data = pl.Series(col.intData);
        removeFromCol = this.columnModel.update({
          data: {
            intData: undefined,
            numericColumnValidation: undefined,
            summary: {
              intSummary: undefined
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      case 'FLOAT':
        data = pl.Series(col.floatData);
        removeFromCol = this.columnModel.update({
          data: {
            floatData: undefined,
            numericColumnValidation: undefined,
            summary: {
              floatSummary: undefined
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      case 'ENUM':
        data = pl.Series(col.enumData);
        removeFromCol = this.columnModel.update({
          data: {
            enumColumnValidation: undefined,
            enumData: undefined,
            summary: {
              enumSummary: undefined
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      case 'DATETIME':
        data = pl.Series(col.datetimeData);
        removeFromCol = this.columnModel.update({
          data: {
            datetimeColumnValidation: undefined,
            datetimeData: undefined,
            summary: {
              datetimeSummary: undefined
            }
          },
          where: {
            id: col.id
          }
        });
        break;
    }

    // one more switch to do pl.series type casting .cast(type, strict = true)
    // if the cast is passed, add new data, summary, and validation to the column
    let addToCol;
    switch (colType) {
      case 'BOOLEAN':
        data = data.cast(pl.Bool, true);
        addToCol = this.columnModel.update({
          data: {
            booleanData: data.toArray(),
            enumColumnValidation: {},
            summary: {
              count: data.len() - data.nullCount(),
              // valueCounts() function always return null.
              // issue opened on nodejs-polars github
              // enumSummary: {
              //   distribution: data.valueCounts().toJSON()
              // },
              nullCount: data.nullCount()
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      case 'STRING':
        data = data.cast(pl.Utf8, true);
        addToCol = this.columnModel.update({
          data: {
            stringColumnValidation: {
              minLength: 0
            },
            stringData: data.toArray(),
            summary: {
              count: data.len() - data.nullCount(),
              nullCount: data.nullCount()
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      case 'INT':
        data = data.cast(pl.Int64, true);
        addToCol = this.columnModel.update({
          data: {
            intData: data.toArray(),
            numericColumnValidation: {
              max: data.max(),
              min: data.min()
            },
            summary: {
              count: data.len() - data.nullCount(),
              intSummary: {
                max: data.max(),
                mean: data.mean(),
                median: data.median(),
                min: data.min(),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                mode: data.mode()[0],
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                std: data.rollingStd(data.len())[-1]
              },
              nullCount: data.len()
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      case 'FLOAT':
        data = data.cast(pl.Float64, true);
        addToCol = this.columnModel.update({
          data: {
            floatData: data.toArray(),
            numericColumnValidation: {
              max: data.max(),
              min: data.min()
            },
            summary: {
              count: data.len() - data.nullCount(),
              floatSummary: {
                max: data.max(),
                mean: data.mean(),
                median: data.median(),
                min: data.min(),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                std: data.rollingStd(data.len())[-1]
              },
              nullCount: data.nullCount()
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      case 'ENUM':
        data = data.cast(pl.Utf8, true);
        addToCol = this.columnModel.update({
          data: {
            enumData: data.toArray(),
            summary: {
              count: data.len() - data.nullCount(),
              // valueCounts() function always return null.
              // issue opened on nodejs-polars github
              // enumSummary: {
              //   distribution: data.valueCounts().toJSON()
              // },
              nullCount: data.nullCount()
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      case 'DATETIME':
        data = data.cast(pl.Date, true);
        addToCol = this.columnModel.update({
          data: {
            datetimeColumnValidation: {
              max: new Date(),
              min: '1970-01-01'
            },
            datetimeData: data.toArray(),
            summary: {
              count: data.len() - data.nullCount(),
              datetimeSummary: {
                max: new Date(),
                min: '1970-01-01'
              },
              nullCount: data.nullCount()
            }
          },
          where: {
            id: col.id
          }
        });
        break;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return (await this.prisma.$transaction([removeFromCol, addToCol])) as unknown[];
  }

  async toggleColumnNullable(columnId: string) {
    const col = await this.getById(columnId);
    if (col.nullable && col.summary.nullCount !== col.summary.count) {
      throw new ForbiddenException('Cannot set this column to not nullable as it contains null values already!');
    }

    const updateColumnNullable = this.columnModel.update({
      data: {
        nullable: !col.nullable
      },
      where: {
        id: columnId
      }
    });

    return await updateColumnNullable;
  }

  async updateMany(tabularDataId: string, updateColumnDto: UpdateTabularColumnDto) {
    const columnsToUpdate = await this.columnModel.findMany({
      where: {
        tabularDataId: tabularDataId
      }
    });

    if (!columnsToUpdate) {
      throw new NotFoundException('No columns found with the given tabular data id!');
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    columnsToUpdate.forEach(async (x) => {
      await this.columnModel.update({
        data: updateColumnDto,
        where: {
          id: x.id
        }
      });
    });
  }

  private calculateSummaryOnSeries(colType: ColumnType, currSeries: Series) {
    // Need to correctly compute the distribution for boolean and enum column
    switch (colType) {
      case 'BOOLEAN':
        return {
          count: currSeries.len() - currSeries.nullCount(),
          datetimeSummary: null,
          enumSummary: {
            distribution: currSeries.valueCounts().toRecords() as unknown as { [key: string]: number }
          },
          floatSummary: null,
          intSummary: null,
          nullCount: currSeries.nullCount()
        };
      case 'STRING':
        return {
          count: currSeries.len() - currSeries.nullCount(),
          datetimeSummary: null,
          enumSummary: null,
          floatSummary: null,
          intSummary: null,
          nullCount: currSeries.nullCount()
        };
      case 'INT':
        return {
          count: currSeries.len() - currSeries.nullCount(),
          datetimeSummary: null,
          enumSummary: null,
          floatSummary: null,
          intSummary: {
            max: currSeries.max(),
            mean: currSeries.mean(),
            median: currSeries.median(),
            min: currSeries.min(),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            mode: currSeries.mode()[0],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            std: currSeries.rollingStd(currSeries.len())[-1]
          },
          nullCount: currSeries.nullCount()
        };
      case 'FLOAT':
        return {
          count: currSeries.len() - currSeries.nullCount(),
          datetimeSummary: null,
          enumSummary: null,
          floatSummary: {
            max: currSeries.max(),
            mean: currSeries.mean(),
            median: currSeries.median(),
            min: currSeries.min(),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            std: currSeries.rollingStd(currSeries.len())[-1]
          },
          intSummary: null,
          nullCount: currSeries.nullCount()
        };
      case 'ENUM':
        return {
          count: currSeries.len() - currSeries.nullCount(),
          datetimeSummary: null,
          enumSummary: {
            distribution: currSeries.valueCounts().toRecords() as unknown as { [key: string]: number }
          },
          floatSummary: null,
          intSummary: null,
          nullCount: currSeries.nullCount()
        };
      case 'DATETIME':
        return {
          count: currSeries.len() - currSeries.nullCount(),
          datetimeSummary: {
            max: new Date(),
            min: new Date('1970-01-01')
          },
          enumSummary: null,
          floatSummary: null,
          intSummary: null,
          nullCount: currSeries.nullCount()
        };
    }
  }

  // TO-DO: Helper methods to make code more readable
  private async columnIdToSeries(columnId: string) {
    const column = await this.getById(columnId);

    // store column data in a polars series according to the type
    switch (column.kind) {
      case 'BOOLEAN':
        return pl.Series(column.booleanData);
      case 'STRING':
        return pl.Series(column.stringData);
      case 'INT':
        return pl.Series(column.intData);
      case 'FLOAT':
        return pl.Series(column.floatData);
      case 'ENUM':
        return pl.Series(column.enumData);
      case 'DATETIME':
        return pl.Series(column.datetimeData);
    }
  }

  // validateColumn() {
  //   // return true or false
  // }
}
