import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { ColumnType, PermissionLevel } from '@prisma/client';
import type { PrismaClient } from '@prisma/client/extension';
import pl, { Series } from 'nodejs-polars';

import { InjectModel, InjectPrismaClient } from '@/core/decorators/inject-prisma-client.decorator';
import type { DatasetsService } from '@/datasets/datasets.service';
import type { Model } from '@/prisma/prisma.types';
import type { GetColumnViewDto } from '@/projects/zod/projects';

import type { CreateTabularColumnDto, UpdateTabularColumnDto } from './zod/columns';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel('TabularData') private readonly tabularDataModel: Model<'TabularData'>,
    @InjectModel('TabularColumn') private readonly columnModel: Model<'TabularColumn'>,
    @InjectPrismaClient() private readonly prisma: PrismaClient,
    private readonly datasetService: DatasetsService
  ) {}

  async changeColumnDataPermission(columnId: string, currentUserId: string, permissionLevel: PermissionLevel) {
    await this.canModifyColumn(columnId, currentUserId);
    return await this.columnModel.update({
      data: {
        dataPermission: permissionLevel
      },
      where: {
        id: columnId
      }
    });
  }

  async changeColumnMetadataPermission(columnId: string, currentUserId: string, permissionLevel: PermissionLevel) {
    await this.canModifyColumn(columnId, currentUserId);
    return await this.columnModel.update({
      data: {
        summaryPermission: permissionLevel
      },
      where: {
        id: columnId
      }
    });
  }

  async create(tabularColumn: CreateTabularColumnDto) {
    return await this.columnModel.create({
      data: tabularColumn
    });
  }

  async deleteById(columnId: string, currentUserId: string) {
    const column = await this.canModifyColumn(columnId, currentUserId);
    return await this.columnModel.delete({
      where: {
        id: column.id
      }
    });
  }

  deleteByTabularDataId(tabularDataId: string) {
    return this.columnModel.delete({
      where: {
        tabularDataId: tabularDataId
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
    let currSeries: Series;
    switch (columnView.kind) {
      case 'BOOLEAN':
        currSeries = pl.Series(columnView.booleanData);
        break;
      case 'STRING':
        currSeries = pl.Series(columnView.stringData);
        break;
      case 'INT':
        currSeries = pl.Series(columnView.intData);
        break;
      case 'FLOAT':
        currSeries = pl.Series(columnView.floatData);
        break;
      case 'ENUM':
        currSeries = pl.Series(columnView.enumData);
        break;
      case 'DATETIME':
        currSeries = pl.Series(columnView.datetimeData);
        break;
    }

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
    switch (columnView.kind) {
      case 'BOOLEAN':
        columnView.summary = {
          count: currSeries.len() - currSeries.nullCount(),
          datetimeSummary: null,
          enumSummary: {
            distribution: currSeries.valueCounts().toJSON()
          },
          floatSummary: null,
          intSummary: null,
          notNullCount: currSeries.nullCount()
        };
        break;
      case 'STRING':
        columnView.summary = {
          count: currSeries.len() - currSeries.nullCount(),
          datetimeSummary: null,
          enumSummary: null,
          floatSummary: null,
          intSummary: null,
          notNullCount: currSeries.nullCount()
        };
        break;
      case 'INT':
        columnView.summary = {
          count: currSeries.len() - currSeries.nullCount(),
          datetimeSummary: null,
          enumSummary: null,
          floatSummary: null,
          intSummary: {
            max: currSeries.max(),
            mean: currSeries.mean(),
            median: currSeries.median(),
            min: currSeries.min(),
            mode: currSeries.mode()[0],
            std: currSeries.rollingStd(currSeries.len())[-1]
          },
          notNullCount: currSeries.nullCount()
        };
        break;
      case 'FLOAT':
        columnView.summary = {
          count: currSeries.len() - currSeries.nullCount(),
          datetimeSummary: null,
          enumSummary: null,
          floatSummary: {
            max: currSeries.max(),
            mean: currSeries.mean(),
            median: currSeries.median(),
            min: currSeries.min(),
            std: currSeries.rollingStd(currSeries.len())[-1]
          },
          intSummary: null,
          notNullCount: currSeries.nullCount()
        };
        break;
      case 'ENUM':
        columnView.summary = {
          count: currSeries.len() - currSeries.nullCount(),
          datetimeSummary: null,
          enumSummary: {
            distribution: currSeries.valueCounts().toJSON()
          },
          floatSummary: null,
          intSummary: null,
          notNullCount: currSeries.nullCount()
        };
        break;
      case 'DATETIME':
        columnView.summary = {
          count: currSeries.len() - currSeries.nullCount(),
          datetimeSummary: {
            max: new Date(),
            min: new Date('1970-01-01')
          },
          enumSummary: null,
          floatSummary: null,
          intSummary: null,
          notNullCount: currSeries.nullCount()
        };
        break;
    }

    return columnView;
  }

  async mutateColumnType(columnId: string, currentUserId: string, colType: ColumnType) {
    const col = await this.canModifyColumn(columnId, currentUserId);
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
              count: data.len(),
              // valueCounts() function always return null.
              // issue opened on nodejs-polars github
              // enumSummary: {
              //   distribution: data.valueCounts().toJSON()
              // },
              notNullCount: data.len() - data.nullCount()
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
              count: data.len(),
              notNullCount: data.len() - data.nullCount()
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
              count: data.len(),
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
              notNullCount: data.len() - data.nullCount()
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
              count: data.len(),
              floatSummary: {
                max: data.max(),
                mean: data.mean(),
                median: data.median(),
                min: data.min(),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                std: data.rollingStd(data.len())[-1]
              },
              notNullCount: data.len() - data.nullCount()
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
              count: data.len(),
              // valueCounts() function always return null.
              // issue opened on nodejs-polars github
              // enumSummary: {
              //   distribution: data.valueCounts().toJSON()
              // },
              notNullCount: data.len() - data.nullCount()
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
              count: data.len(),
              datetimeSummary: {
                max: new Date(),
                min: '1970-01-01'
              },
              notNullCount: data.len() - data.nullCount()
            }
          },
          where: {
            id: col.id
          }
        });
        break;
    }

    return (await this.prisma.$transaction([removeFromCol, addToCol])) as unknown[];
  }

  async toggleColumnNullable(columnId: string, currentUserId: string) {
    const col = await this.canModifyColumn(columnId, currentUserId);

    if (col.nullable && col.summary.notNullCount !== col.summary.count) {
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

    return await this.prisma.$transaction([updateColumnNullable]);
  }

  async updateMany(tabularDataId: string, updateColumnDto: UpdateTabularColumnDto) {
    return await this.columnModel.update({
      data: updateColumnDto,
      where: {
        tabularDataId
      }
    });
  }

  private async canModifyColumn(columnId: string, currentUserId: string) {
    const col = await this.columnModel.findUnique({
      where: {
        id: columnId
      }
    });
    if (!col) {
      throw new NotFoundException();
    }

    const tabularData = await this.tabularDataModel.findUnique({
      where: {
        id: col.tabularDataId
      }
    });
    if (!tabularData) {
      throw new NotFoundException();
    }

    if (!(await this.datasetService.canModifyDataset(tabularData.datasetId, currentUserId))) {
      throw new ForbiddenException('Only managers can modify this dataset!');
    }
    return col;
  }
}
