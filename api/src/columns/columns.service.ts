import {
  $ColumnType,
  $DatasetViewPagination,
  $GetColumnViewDto,
  $PermissionLevel,
  $RawQueryColumn
} from '@databank/core';
import type { Model } from '@douglasneuroinformatics/libnest';
import { InjectModel, InjectPrismaClient } from '@douglasneuroinformatics/libnest';
import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';
import pl, { Utf8 } from 'nodejs-polars';
import type { Series } from 'nodejs-polars';

import { getColumnDataArray } from './column-data.utils';

type ProjectColumnView = Pick<
  NonNullable<Awaited<ReturnType<Model<'TabularColumn'>['findUnique']>>>,
  | 'dataPermission'
  | 'datetimeData'
  | 'description'
  | 'enumData'
  | 'floatData'
  | 'id'
  | 'intData'
  | 'kind'
  | 'name'
  | 'nullable'
  | 'stringData'
  | 'summary'
  | 'summaryPermission'
  | 'tabularDataId'
>;

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel('TabularColumn') private readonly columnModel: Model<'TabularColumn'>,
    @InjectPrismaClient() private readonly prisma: PrismaClient
  ) {}

  async changeColumnDataPermission(columnId: string, permissionLevel: $PermissionLevel) {
    return await this.columnModel.update({
      data: {
        dataPermission: permissionLevel
      },
      where: {
        id: columnId
      }
    });
  }

  async changeColumnMetadataPermission(columnId: string, permissionLevel: $PermissionLevel) {
    return await this.columnModel.update({
      data: {
        summaryPermission: permissionLevel
      },
      where: {
        id: columnId
      }
    });
  }

  async createFromSeries(tabularDataId: string, colSeries: Series, permissionLevel: $PermissionLevel = 'MANAGER') {
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
          dataPermission: permissionLevel,
          floatData: dataArray,
          kind: 'FLOAT',
          name: colSeries.name,
          nullable: colSeries.nullCount() !== 0,
          summary: {
            count: colSeries.len() - colSeries.nullCount(),
            floatSummary: floatSummary.floatSummary,
            nullCount: colSeries.nullCount()
          },
          summaryPermission: permissionLevel,
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
          dataPermission: permissionLevel,
          intData: dataArray,
          kind: 'INT',
          name: colSeries.name,
          nullable: colSeries.nullCount() !== 0,
          summary: {
            count: colSeries.len() - colSeries.nullCount(),
            intSummary: intSummary.intSummary,
            nullCount: colSeries.nullCount()
          },
          summaryPermission: permissionLevel,
          tabularDataId: tabularDataId
        }
      });
    }

    // create a boolean column
    if (colSeries.isBoolean()) {
      const enumSummary = this.calculateSummaryOnSeries('ENUM', colSeries);
      if (!enumSummary?.enumSummary) {
        throw new NotFoundException('Enum summary NOT FOUND!');
      }

      await this.columnModel.create({
        data: {
          dataPermission: permissionLevel,
          enumData: dataArray.map((entry) => {
            return { value: String(entry.value) };
          }),
          kind: 'ENUM',
          name: colSeries.name,
          nullable: colSeries.nullCount() !== 0,
          summary: {
            count: colSeries.len() - colSeries.nullCount(),
            enumSummary: {
              distribution: enumSummary.enumSummary.distribution.map((entry) => {
                return {
                  '': entry[colSeries.name] ? 'True' : 'False',
                  count: entry.count as number
                };
              })
            },
            nullCount: colSeries.nullCount()
          },
          summaryPermission: permissionLevel,
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
          dataPermission: permissionLevel,
          datetimeData: dataArray,
          kind: 'DATETIME',
          name: colSeries.name,
          nullable: colSeries.nullCount() !== 0,
          summary: {
            count: colSeries.len() - colSeries.nullCount(),
            datetimeSummary: datetimeSummary.datetimeSummary,
            nullCount: colSeries.nullCount()
          },
          summaryPermission: permissionLevel,
          tabularDataId: tabularDataId
        }
      });
    }

    // create a string column
    if (colSeries.isString()) {
      await this.columnModel.create({
        data: {
          dataPermission: permissionLevel,
          kind: 'STRING',
          name: colSeries.name,
          nullable: colSeries.nullCount() !== 0,
          stringData: dataArray,
          summary: {
            count: colSeries.len() - colSeries.nullCount(),
            nullCount: colSeries.nullCount()
          },
          summaryPermission: permissionLevel,
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

  async findManyByTabularDataId(
    tabularDataId: string,
    columnPagination: $DatasetViewPagination
  ): Promise<$RawQueryColumn[]> {
    const columns = await this.columnModel.aggregateRaw({
      // Pipeline stages:
      // 1. $match: Filter columns by tabularDataId
      // 2. $sort: Ensure consistent pagination order
      // 3. $skip/$limit: Implement pagination based on currentPage and itemsPerPage
      pipeline: [
        { $match: { tabularDataId: { $oid: tabularDataId } } },
        { $sort: { _id: 1 } },
        { $skip: (columnPagination.currentPage - 1) * columnPagination.itemsPerPage },
        { $limit: columnPagination.itemsPerPage }
      ]
    });

    if (columns.length === 0) {
      throw new NotFoundException('No columns found with the given tabular data id!');
    }

    return columns as unknown as $RawQueryColumn[];
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

  async getLengthById(columnId: string) {
    const col = await this.columnModel.findUnique({
      where: {
        id: columnId
      }
    });

    if (!col) {
      throw new UnprocessableEntityException('Column type does not match any expected types!');
    }
    return getColumnDataArray(col).length;
  }

  async getNumberOfColumns(tabularDataId: string) {
    return await this.columnModel.count({
      where: {
        tabularDataId: tabularDataId
      }
    });
  }

  async getProjectColumnView(getColumnViewDto: $GetColumnViewDto): Promise<ProjectColumnView> {
    const projectColumn = await this.columnModel.findUnique({
      where: {
        id: getColumnViewDto.columnId
      }
    });

    if (!projectColumn) {
      throw new NotFoundException(`Column with ID ${getColumnViewDto.columnId} cannot be found!`);
    }

    const originalKind = projectColumn.kind;
    const dataArray = getColumnDataArray(projectColumn);
    const values = dataArray.slice(getColumnViewDto.rowMin, getColumnViewDto.rowMax).map((entry) => entry.value);
    const series = pl.Series(values);

    const hasTransform = !!(getColumnViewDto.hash ?? getColumnViewDto.trim);

    if (hasTransform || originalKind === 'STRING') {
      let stringSeries = originalKind === 'STRING' ? series : series.cast(Utf8);

      if (getColumnViewDto.hash) {
        if (getColumnViewDto.hash.salt) {
          const stringArray = stringSeries.toArray();
          const saltedArray = stringArray.map((entry) =>
            entry == null ? null : (entry as string) + getColumnViewDto.hash!.salt
          );
          stringSeries = pl.Series(saltedArray);
        }
        stringSeries = stringSeries.hash().cast(Utf8).str.slice(0, getColumnViewDto.hash.length);
      }

      if (getColumnViewDto.trim) {
        const sliceStart = getColumnViewDto.trim.start ?? 0;
        const sliceLength = getColumnViewDto.trim.end != null ? getColumnViewDto.trim.end - sliceStart : undefined;
        stringSeries = stringSeries.str.slice(sliceStart, sliceLength);
      }

      projectColumn.kind = 'STRING';
      const newSummary = this.calculateSummaryOnSeries('STRING', stringSeries);
      projectColumn.summary.count = newSummary.count;
      projectColumn.summary.nullCount = newSummary.nullCount;
      projectColumn.summary.datetimeSummary = null;
      projectColumn.summary.enumSummary = null;
      projectColumn.summary.floatSummary = null;
      projectColumn.summary.intSummary = null;
      projectColumn.stringData = stringSeries.toArray().map((entry) => {
        return { value: entry as string };
      });
    } else {
      const newSummary = this.calculateSummaryOnSeries(originalKind, series);
      projectColumn.summary.count = newSummary.count;
      projectColumn.summary.nullCount = newSummary.nullCount;
      switch (originalKind) {
        case 'DATETIME':
          projectColumn.summary.datetimeSummary = newSummary.datetimeSummary!;
          projectColumn.datetimeData = series.toArray().map((entry) => ({ value: entry as Date }));
          break;
        case 'ENUM':
          projectColumn.summary.enumSummary = newSummary.enumSummary!;
          projectColumn.enumData = series.toArray().map((entry) => ({ value: entry as string }));
          break;
        case 'FLOAT':
          projectColumn.summary.floatSummary = newSummary.floatSummary!;
          projectColumn.floatData = series.toArray().map((entry) => ({ value: entry as number }));
          break;
        case 'INT':
          projectColumn.summary.intSummary = newSummary.intSummary!;
          projectColumn.intData = series.toArray().map((entry) => ({ value: entry as number }));
          break;
      }
    }

    return projectColumn;
  }

  async mutateColumnType(columnId: string, colType: $ColumnType) {
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
      case 'DATETIME':
        data = pl.Series(col.datetimeData.map((entry) => Object.values(entry)[0]));
        removeFromCol = this.columnModel.update({
          data: {
            datetimeColumnValidation: undefined,
            datetimeData: undefined,
            summary: {
              count: 0,
              datetimeSummary: undefined,
              nullCount: 0
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
              count: 0,
              enumSummary: undefined,
              nullCount: 0
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
              count: 0,
              floatSummary: undefined,
              nullCount: 0
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
              count: 0,
              intSummary: undefined,
              nullCount: 0
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
            stringData: undefined
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
      case 'DATETIME': {
        data = data.cast(pl.Date, true);
        const newDatetimeSummary = this.calculateSummaryOnSeries('DATETIME', data);
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
              count: newDatetimeSummary.count,
              datetimeSummary: newDatetimeSummary.datetimeSummary,
              nullCount: newDatetimeSummary.nullCount
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      }
      case 'ENUM': {
        data = data.cast(pl.Utf8, true);
        const newEnumSummary = this.calculateSummaryOnSeries('ENUM', data);
        addToCol = this.columnModel.update({
          data: {
            enumData: data.toArray().map((entry: string) => {
              return { value: entry };
            }),
            kind: colType,
            summary: {
              count: newEnumSummary.count,
              enumSummary: newEnumSummary.enumSummary,
              nullCount: newEnumSummary.nullCount
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      }
      case 'FLOAT': {
        data = data.cast(pl.Float64, true);
        const newFloatSummary = this.calculateSummaryOnSeries('FLOAT', data);
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
              count: newFloatSummary.count,
              floatSummary: newFloatSummary.floatSummary,
              nullCount: newFloatSummary.nullCount
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      }
      case 'INT': {
        data = data.cast(pl.Int64, true);
        const newIntSummary = this.calculateSummaryOnSeries('INT', data);
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
              count: newIntSummary.count,
              intSummary: newIntSummary.intSummary,
              nullCount: newIntSummary.nullCount
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      }
      case 'STRING': {
        data = data.cast(pl.Utf8, true);
        const newStringSummary = this.calculateSummaryOnSeries('STRING', data);
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
              count: newStringSummary.count,
              nullCount: newStringSummary.nullCount
            }
          },
          where: {
            id: col.id
          }
        });
        break;
      }
    }

    return (await this.prisma.$transaction([removeFromCol, addToCol])) as unknown[];
  }

  async toggleColumnNullable(columnId: string) {
    const col = await this.getById(columnId);
    if (col.nullable && col.summary.nullCount !== 0) {
      throw new UnprocessableEntityException(
        'Cannot set this column to not nullable as it contains null values already!'
      );
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

  private calculateSummaryOnSeries(colType: $ColumnType, currSeries: Series) {
    switch (colType) {
      case 'DATETIME':
        return {
          count: currSeries.len() - currSeries.nullCount(),
          datetimeSummary: {
            max: new Date(currSeries.max() * 24 * 3600 * 1000),
            min: new Date(currSeries.min() * 24 * 3600 * 1000)
          },
          nullCount: currSeries.nullCount()
        };
      case 'ENUM':
        return {
          count: currSeries.len() - currSeries.nullCount(),
          enumSummary: {
            distribution: currSeries.valueCounts().toRecords()
          },
          nullCount: currSeries.nullCount()
        };
      case 'FLOAT':
        return {
          count: currSeries.len() - currSeries.nullCount(),
          floatSummary: {
            max: currSeries.max(),
            mean: currSeries.mean(),
            median: currSeries.median(),
            min: currSeries.min(),
            std: pl.DataFrame({ dummy: currSeries }).std().getColumn('dummy')[0] as number
          },
          nullCount: currSeries.nullCount()
        };
      case 'INT':
        return {
          count: currSeries.len() - currSeries.nullCount(),
          intSummary: {
            max: currSeries.max(),
            mean: currSeries.mean(),
            median: currSeries.median(),
            min: currSeries.min(),
            mode: currSeries.filter(currSeries.isNotNull()).mode()[0] as number,
            std: pl.DataFrame({ dummy: currSeries }).std().getColumn('dummy')[0] as number
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
}
