import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { ColumnType, PermissionLevel } from '@prisma/client';
import type { PrismaClient } from '@prisma/client/extension';

import { InjectModel, InjectPrismaClient } from '@/core/decorators/inject-prisma-client.decorator';
import type { Model } from '@/prisma/prisma.types';
import type { GetColumnViewDto } from '@/projects/zod/projects';
import { pl, type Series } from '@/vendor/nodejs-polars.js';

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

  async findManyByTabularDataId(tabularDataId: string) {
    const columns = await this.columnModel.findMany({
      where: {
        tabularDataId: tabularDataId
      }
    });

    if (!columns) {
      throw new NotFoundException('No columns found with the given tabular data id!');
    }

    return columns;
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
    let currSeries = await this.columnIdToSeries(getColumnViewDto.columnId);
    // check if there is a row max and min bound
    if (getColumnViewDto.rowMax && getColumnViewDto.rowMin) {
      currSeries = currSeries.slice(getColumnViewDto.rowMin, getColumnViewDto.rowMax - getColumnViewDto.rowMin + 1);
    } else if (getColumnViewDto.rowMin && !getColumnViewDto.rowMax) {
      currSeries = currSeries.slice(getColumnViewDto.rowMin);
    } else if (getColumnViewDto.rowMax && !getColumnViewDto.rowMin) {
      currSeries = currSeries.slice(0, getColumnViewDto.rowMax);
    }
    // check for hash, do the hashing
    if (getColumnViewDto.hash) {
      currSeries = currSeries.cast(pl.String);
      if (getColumnViewDto.hash.salt) {
        const saltArr: string[] = [];
        for (let i = 0; i < currSeries.len(); i++) {
          saltArr.push(getColumnViewDto.hash.salt);
        }
        currSeries = pl.Series(
          currSeries.toArray().map((entry) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return entry + getColumnViewDto.hash?.salt;
          })
        );
      }

      currSeries = currSeries.hash().cast(pl.String);
      if (getColumnViewDto.hash.length && getColumnViewDto.hash.length >= 0) {
        currSeries = currSeries.str.slice(0, getColumnViewDto.hash.length);
      }
      currSeries.cast(pl.String);
      columnView.kind = 'STRING';
    }

    if (getColumnViewDto.trim && columnView.kind === 'STRING') {
      // trim the string in each cell of a string column
      // the slice function takes two parameters: offset and length(optional)
      if (getColumnViewDto.trim.start && getColumnViewDto.trim.end) {
        currSeries = currSeries.str.slice(
          getColumnViewDto.trim.start,
          getColumnViewDto.trim.end - getColumnViewDto.trim.start + 1
        );
      } else if (getColumnViewDto.trim.start && !getColumnViewDto.trim.end) {
        currSeries = currSeries.str.slice(getColumnViewDto.trim.start);
      } else if (!getColumnViewDto.trim.start && getColumnViewDto.trim.end) {
        currSeries = currSeries.str.slice(0, getColumnViewDto.trim.end + 1);
      }
    }
    // recalculate the summary for the column
    columnView.summary = this.calculateSummaryOnSeries(columnView.kind, currSeries);
    type ColumnMetadata = {
      count: number;
      distribution?: { [key: string]: number }[];
      kind: ColumnType;
      max?: Date | number;
      mean?: number;
      median?: number;
      min?: Date | number;
      mode?: number;
      nullable: boolean;
      nullCount: number;
      std?: number;
    };

    let columnMetadata: ColumnMetadata = {
      count: 0,
      kind: 'STRING',
      nullable: false,
      nullCount: 0
    };
    switch (columnView.kind) {
      case 'BOOLEAN':
        columnView.booleanData = currSeries.toArray().map((entry) => {
          return {
            value: entry as boolean
          };
        });
        columnMetadata.count = columnView.summary.count;
        columnMetadata.nullCount = columnView.summary.nullCount;
        columnMetadata.kind = 'BOOLEAN';
        columnMetadata.nullable = columnView.nullable;
        break;
      case 'INT':
        columnView.intData = currSeries.toArray().map((entry) => {
          return {
            value: entry as number
          };
        });
        columnMetadata.count = columnView.summary.count;
        columnMetadata.nullCount = columnView.summary.nullCount;
        columnMetadata.kind = 'INT';
        columnMetadata.nullable = columnView.nullable;
        columnMetadata.max = columnView.summary.intSummary?.max;
        columnMetadata.min = columnView.summary.intSummary?.min;
        columnMetadata.mean = columnView.summary.intSummary?.mean;
        columnMetadata.mode = columnView.summary.intSummary?.mode;
        columnMetadata.median = columnView.summary.intSummary?.median;
        columnMetadata.std = columnView.summary.intSummary?.std;
        break;
      case 'FLOAT':
        columnView.floatData = currSeries.toArray().map((entry) => {
          return {
            value: entry as number
          };
        });
        columnMetadata.count = columnView.summary.count;
        columnMetadata.nullCount = columnView.summary.nullCount;
        columnMetadata.kind = 'FLOAT';
        columnMetadata.nullable = columnView.nullable;
        columnMetadata.max = columnView.summary.floatSummary?.max;
        columnMetadata.min = columnView.summary.floatSummary?.min;
        columnMetadata.mean = columnView.summary.floatSummary?.mean;
        columnMetadata.median = columnView.summary.floatSummary?.median;
        columnMetadata.std = columnView.summary.floatSummary?.std;
        break;
      case 'STRING':
        columnView.stringData = currSeries.toArray().map((entry) => {
          return {
            value: entry as string
          };
        });
        columnMetadata.count = columnView.summary.count;
        columnMetadata.nullCount = columnView.summary.nullCount;
        columnMetadata.kind = 'STRING';
        columnMetadata.nullable = columnView.nullable;
        break;
      case 'ENUM':
        columnView.enumData = currSeries.toArray().map((entry) => {
          return {
            value: entry as string
          };
        });
        columnMetadata.count = columnView.summary.count;
        columnMetadata.nullCount = columnView.summary.nullCount;
        columnMetadata.kind = 'ENUM';
        columnMetadata.nullable = columnView.nullable;
        break;
      case 'DATETIME':
        columnView.datetimeData = currSeries.toArray().map((entry) => {
          return {
            value: entry as Date
          };
        });
        columnMetadata.count = columnView.summary.count;
        columnMetadata.nullCount = columnView.summary.nullCount;
        columnMetadata.kind = 'DATETIME';
        columnMetadata.nullable = columnView.nullable;
        columnMetadata.max = columnView.summary.datetimeSummary?.max;
        columnMetadata.min = columnView.summary.datetimeSummary?.min;
        break;
    }

    return {
      booleanData: columnView.booleanData,
      count: columnView.summary.count,
      datetimeData: columnView.datetimeData,
      enumData: columnView.enumData,
      floatData: columnView.floatData,
      id: columnView.id,
      intData: columnView.intData,
      kind: columnView.kind,
      max: columnMetadata.max,
      mean: columnMetadata.mean,
      median: columnMetadata.median,
      min: columnMetadata.min,
      mode: columnMetadata.mode,
      name: columnView.name,
      nullable: columnView.nullable,
      nullCount: columnView.summary.nullCount,
      std: columnMetadata.std,
      stringData: columnView.stringData
    };
  }

  async getLengthById(columnId: string) {
    const col = await this.columnModel.findUnique({
      where: {
        id: columnId
      }
    });

    if (col?.kind === 'BOOLEAN') {
      return col.booleanData.length;
    }
    if (col?.kind === 'STRING') {
      return col.stringData.length;
    }
    if (col?.kind === 'INT') {
      return col.intData.length;
    }
    if (col?.kind === 'FLOAT') {
      return col.floatData.length;
    }
    if (col?.kind === 'DATETIME') {
      return col.datetimeData.length;
    }
    if (col?.kind === 'ENUM') {
      return col.enumData.length;
    }
    throw new ForbiddenException('Column type does not match any expected types!');
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
        data = pl.Series(col.booleanData.map((entry) => Object.values(entry)[0]));
        removeFromCol = this.columnModel.update({
          data: {
            booleanData: undefined,
            enumColumnValidation: undefined,
            summary: {
              count: data.len() - data.nullCount(),
              enumSummary: undefined,
              nullCount: data.nullCount()
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      case 'STRING':
        data = pl.Series(col.stringData.map((entry) => Object.values(entry)[0]));
        removeFromCol = this.columnModel.update({
          data: {
            stringColumnValidation: undefined,
            stringData: undefined,
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
        data = pl.Series(col.intData.map((entry) => Object.values(entry)[0]));
        removeFromCol = this.columnModel.update({
          data: {
            intData: undefined,
            numericColumnValidation: undefined,
            summary: {
              count: data.len() - data.nullCount(),
              intSummary: undefined,
              nullCount: data.nullCount()
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      case 'FLOAT':
        data = pl.Series(col.floatData.map((entry) => Object.values(entry)[0]));
        removeFromCol = this.columnModel.update({
          data: {
            floatData: undefined,
            numericColumnValidation: undefined,
            summary: {
              count: data.len() - data.nullCount(),
              floatSummary: undefined,
              nullCount: data.nullCount()
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      case 'ENUM':
        data = pl.Series(col.enumData.map((entry) => Object.values(entry)[0]));
        removeFromCol = this.columnModel.update({
          data: {
            enumColumnValidation: undefined,
            enumData: undefined,
            summary: {
              count: data.len() - data.nullCount(),
              enumSummary: undefined,
              nullCount: data.nullCount()
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      case 'DATETIME':
        data = pl.Series(col.datetimeData.map((entry) => Object.values(entry)[0]));
        removeFromCol = this.columnModel.update({
          data: {
            datetimeColumnValidation: undefined,
            datetimeData: undefined,
            summary: {
              count: data.len() - data.nullCount(),
              datetimeSummary: undefined,
              nullCount: data.nullCount()
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
            booleanData: data.toArray().map((entry: boolean) => {
              return { value: entry };
            }),
            enumColumnValidation: {},
            kind: colType,
            summary: {
              count: data.len() - data.nullCount(),
              // valueCounts() function always return null.
              // issue opened on nodejs-polars github
              enumSummary: {
                distribution: data.valueCounts().toJSON()
              },
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
            datetimeData: data.toArray().map((entry: Date) => {
              return { value: entry };
            }),
            kind: colType,
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
      case 'ENUM':
        data = data.cast(pl.Utf8, true);
        addToCol = this.columnModel.update({
          data: {
            enumData: data.toArray().map((entry: string) => {
              return { value: entry };
            }),
            kind: colType,
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
      case 'FLOAT':
        data = data.cast(pl.Float64, true);
        addToCol = this.columnModel.update({
          data: {
            floatData: data.toArray().map((entry: number) => {
              return { value: entry };
            }),
            kind: colType,
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
                // @ts-expect-error - see issue
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
      case 'INT':
        data = data.cast(pl.Int64, true);
        addToCol = this.columnModel.update({
          data: {
            intData: data.toArray().map((entry: number) => {
              return { value: entry };
            }),
            kind: colType,
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
                // @ts-expect-error - see issue
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
      case 'STRING':
        data = data.cast(pl.Utf8, true);
        addToCol = this.columnModel.update({
          data: {
            kind: colType,
            stringColumnValidation: {
              minLength: 0
            },
            stringData: data.toArray().map((entry: string) => {
              return { value: entry };
            }),
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
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return (await this.prisma.$transaction([removeFromCol, addToCol])) as unknown[];
  }

  async toggleColumnNullable(columnId: string) {
    const col = await this.getById(columnId);
    if (col.nullable && col.summary.nullCount !== 0) {
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
      case 'DATETIME':
        return {
          count: currSeries.len() - currSeries.nullCount(),
          datetimeSummary: {
            max: new Date(currSeries.max() * 24 * 3600 * 1000),
            min: new Date(currSeries.min() * 24 * 3600 * 1000)
          },
          enumSummary: null,
          floatSummary: null,
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
            std: currSeries.filter(currSeries.isNotNull()).rollingStd(currSeries.len() - currSeries.nullCount())[-1]
          },
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
            mode: currSeries.filter(currSeries.isNotNull()).mode()[0],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            std: currSeries.filter(currSeries.isNotNull()).rollingStd(currSeries.len() - currSeries.nullCount())[-1]
          },
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
    }
  }

  private async columnIdToSeries(columnId: string) {
    const column = await this.getById(columnId);

    // store column data in a polars series according to the type
    switch (column.kind) {
      case 'BOOLEAN': {
        const arr = column.booleanData.map((entry) => {
          return entry.value;
        });
        return pl.Series(arr);
      }
      case 'STRING': {
        const arr = column.stringData.map((entry) => {
          return entry.value;
        });
        return pl.Series(arr);
      }
      case 'INT': {
        const arr = column.intData.map((entry) => {
          return entry.value;
        });
        return pl.Series(arr);
      }
      case 'FLOAT': {
        const arr = column.floatData.map((entry) => {
          return entry.value;
        });
        return pl.Series(arr);
      }
      case 'ENUM': {
        const arr = column.enumData.map((entry) => {
          return entry.value;
        });
        return pl.Series(arr);
      }
      case 'DATETIME': {
        const arr = column.datetimeData.map((entry) => {
          return entry.value;
        });
        return pl.Series(arr);
      }
    }
  }

  // validateColumn() {
  //   // return true or false
  // }
}
