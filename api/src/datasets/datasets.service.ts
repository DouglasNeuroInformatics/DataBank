import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ColumnType, PrismaClient } from '@prisma/client';
import { pl } from 'nodejs-polars';

import { InjectModel, InjectPrismaClient } from '@/core/decorators/inject-prisma-client.decorator';
import type { Model } from '@/prisma/prisma.types';

import type { CreateTabularDatasetDto } from './zod/dataset';



@Injectable()
export class DatasetsService {
  constructor(
    @InjectModel('Dataset') private datasetModel: Model<"Dataset">,
    @InjectModel('TabularColumn') private columnModel: Model<'TabularColumn'>,
    @InjectModel('TabularData') private tabularDataModel: Model<'TabularData'>,
    @InjectModel('User') private userModel: Model<"User">,
    @InjectPrismaClient() private prisma: PrismaClient
  ) { }

  async addManager(datasetId: string, managerId: string, managerIdToAdd: string) {
    const dataset = await this.datasetModel.findUnique({
      where: {
        id: datasetId
      }
    });
    if (!dataset) {
      throw new NotFoundException("Dataset not found!")
    }

    if (!(managerId in dataset.managerIds)) {
      throw new ForbiddenException("Only managers of the dataset can add other managers!")
    }

    const managerToAdd = await this.userModel.findUnique({
      where: {
        id: managerIdToAdd
      }
    });

    if (!managerToAdd) {
      throw new NotFoundException("Manager with id " + managerIdToAdd + " is not found!")
    }

    const newDatasetIds = managerToAdd.datasetId;
    newDatasetIds.push(datasetId);

    const updateNewManagerDatasetsIds = this.userModel.update({
      where: {
        id: managerIdToAdd
      },
      data: {
        datasetId: newDatasetIds
      }
    })

    const newManagerIds = dataset.managerIds;
    newManagerIds.push(managerIdToAdd);

    const updateManager = this.datasetModel.update({
      data: {
        managerIds: newManagerIds
      },
      where: {
        id: dataset.id
      }
    })

    return await this.prisma.$transaction([updateNewManagerDatasetsIds, updateManager]);
  }

  async createDataset(createTabularDatasetDto: CreateTabularDatasetDto, file: Express.Multer.File, managerId: string) {
    // file received through the network is stored in memory buffer which is converted to a string
    const csvString = file.buffer.toString().replaceAll('\t', ',');  // polars has a bug parsing tsv, this is a hack for it to work
    const df = pl.readCSV(csvString, { tryParseDates: true });

    if (!this.primaryKeyCheck(createTabularDatasetDto.primaryKeys, df)) {
      throw new ForbiddenException("Dataset failed primary keys check!");
    }

    const dataset = await this.datasetModel.create({
      data: {
        datasetType: 'TABULAR',
        description: createTabularDatasetDto.description,
        isReadyToShare: false,
        managerIds: [managerId],
        name: createTabularDatasetDto.name
      }
    })

    const tabularData = await this.tabularDataModel.create({
      data: {
        datasetId: dataset.id,
        primaryKeys: createTabularDatasetDto.primaryKeys
      }
    });


    for (let col of df.getColumns()) {
      // create a float column
      if (col.isFloat()) {
        await this.columnModel.create({
          data: {
            dataPermission: "MANAGER",
            floatData: col.toArray(),
            name: col.name,
            nullable: col.nullCount() != 0,
            numericColumnValidation: {
              max: col.max(),
              min: col.min()
            },
            summary: {
              count: col.len(),
              floatSummary: {
                max: col.max(),
                mean: col.mean(),
                median: col.median(),
                min: col.min(),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                std: col.rollingStd(col.len())[-1]
              },
              notNullCount: col.len() - col.nullCount()
            },
            summaryPermission: "MANAGER",
            tabularDataId: tabularData.id,
            type: "FLOAT_COLUMN"
          }
        });
        continue;
      }

      // create an int column
      if (col.isNumeric()) {
        await this.columnModel.create({
          data: {
            dataPermission: "MANAGER",
            intData: col.toArray(),
            name: col.name,
            nullable: col.nullCount() != 0,
            numericColumnValidation: {
              max: col.max(),
              min: col.min()
            },
            summary: {
              count: col.len(),
              intSummary: {
                max: col.max(),
                mean: col.mean(),
                median: col.median(),
                min: col.min(),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                mode: col.mode()[0],
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                std: col.rollingStd(col.len())[-1]
              },
              notNullCount: col.len() - col.nullCount()
            },
            summaryPermission: "MANAGER",
            tabularDataId: tabularData.id,
            type: 'INT_COLUMN'
          }
        });
        continue;
      }

      // create a boolean column
      if (col.isBoolean()) {
        await this.columnModel.create({
          data: {
            booleanData: col.toArray(),
            dataPermission: "MANAGER",
            name: col.name,
            nullable: col.nullCount() != 0,
            summary: {
              count: col.len(),
              // valueCounts() function always return null.
              // issue opened on nodejs-polars github
              // enumSummary: {
              //   distribution: col.valueCounts().toJSON()
              // },
              notNullCount: col.len() - col.nullCount()
            },
            summaryPermission: "MANAGER",
            tabularDataId: tabularData.id,
            type: 'BOOLEAN_COLUMN'
          }
        });
        continue;
      }

      // create a boolean column
      if (col.isDateTime()) {
        await this.columnModel.create({
          data: {
            dataPermission: "MANAGER",
            // date is represented as time difference from 1970-Jan-01
            datetimeColumnValidation: {
              max: new Date(),
              min: "1970-01-01",
              passISO: true
            },
            // datetime is represented as milliseconds from 1970-Jan-01 00:00:00
            datetimeData: col.toArray(),
            name: col.name,
            nullable: col.nullCount() != 0,
            summary: {
              count: col.len(),
              datetimeSummary: {
                max: new Date(),
                min: "1970-01-01"
              },
              notNullCount: col.len() - col.nullCount()
            },
            summaryPermission: "MANAGER",
            tabularDataId: tabularData.id,
            type: "DATETIME_COLUMN"
          }
        });
        continue;
      }

      // create a string column
      await this.columnModel.create({
        data: {
          dataPermission: "MANAGER",
          name: col.name,
          nullable: col.nullCount() != 0,
          stringColumnValidation: {
            min: 0,
          },
          stringData: col.toArray(),
          summary: {
            count: col.len(),
            notNullCount: col.len() - col.nullCount()
          },
          summaryPermission: "MANAGER",
          tabularDataId: tabularData.id,
          type: "STRING_COLUMN"
        }
      });
    }

    return dataset;
  }

  async deleteColumn(columnId: string, currentUserId: string) {
    const column = await this.columnModel.findUnique({
      where: {
        id: columnId
      }
    })
    if (!column) {
      throw new NotFoundException();
    }

    const tabularData = await this.tabularDataModel.findUnique({
      where: {
        id: column.tabularDataId
      }
    });
    if (!tabularData) {
      throw new NotFoundException();
    }

    const dataset = await this.datasetModel.findUnique({
      where: {
        id: tabularData.datasetId
      }
    });
    if (!dataset) {
      throw new NotFoundException();
    }
    if (!(currentUserId in dataset.managerIds)) {
      throw new ForbiddenException('Only managers can modify this dataset!');
    }
    await this.columnModel.delete({
      where: {
        id: columnId
      }
    });

    return dataset;
  }

  async deleteDataset(datasetId: string, currentUserId: string) {
    const dataset = await this.datasetModel.findUnique({
      where: {
        id: datasetId
      }
    });
    if (!dataset) {
      throw new NotFoundException('The dataset to be deleted is not found!');
    }

    if (!(currentUserId in dataset.managerIds)) {
      throw new ForbiddenException('Only managers can modify this dataset!');
    }

    const deleteTabularData = this.tabularDataModel.delete({
      where: {
        datasetId: dataset.id
      }
    })

    const deleteColumns = this.columnModel.deleteMany({
      where: {
        tabularDataId: (await deleteTabularData).id
      }
    })

    const deleteTargetDataset = this.datasetModel.delete({
      where: {
        id: dataset.id
      }
    })

    // need to update all users that are managers of this dataset
    const managersToUpdate = await this.userModel.findMany({
      where: {
        datasetId: {
          has: dataset.id
        }
      }
    })

    const updateManagers = []

    for (let manager of managersToUpdate) {
      let newDatasetId = manager.datasetId.filter((val) => val !== dataset.id)
      updateManagers.push(this.userModel.update({
        data: {
          datasetId: newDatasetId
        },
        where: {
          id: manager.id
        }
      }))
    }

    return await this.prisma.$transaction([deleteTabularData, deleteColumns, ...updateManagers, deleteTargetDataset]);
  }

  async getAvailable() {
    // TO-DO: also return datasets that has the current user as a manager
    return await this.datasetModel.findMany({
      where: {
        isReadyToShare: true
      }
    });
  }

  async getById(datasetId: string, currentUserIduserId: string) {
    const dataset = await this.datasetModel.findUnique({
      where: {
        id: datasetId
      }
    });
    if (!dataset) {
      throw new NotFoundException();
    }
    if (!dataset.isReadyToShare && !(currentUserIduserId in dataset.managerIds)) {
      throw new ForbiddenException("The dataset is not ready for share!");
    }

    return dataset;
  }

  async mutateColumnType(columnId: string, colType: ColumnType) {
    const col = await this.columnModel.findUnique({
      where: {
        id: columnId
      }
    })
    if (!col) {
      throw new NotFoundException();
    }

    let updateColumnQuery;
    switch (colType) {
      case "BOOLEAN_COLUMN":
        updateColumnQuery = this.columnModel.update({
          where: {
            id: col.id
          },
          data: 
          
        })
        break;
      case "STRING_COLUMN":
      case "INT_COLUMN":
      case "FLOAT_COLUMN":
      case "ENUM_COLUMN":
      case "DATETIME_COLUMN":
    }
    return this.prisma.$transaction([updateColumnQuery]);
  }

  removeManager(datasetId: string, managerId: string, managerIdToRemove: string) {
    return;
  }

  async setReadyToShare(datasetId: string, currentUserId: string) {
    const dataset = await this.datasetModel.findUnique({
      where: {
        id: datasetId
      }
    });
    if (!dataset || dataset.isReadyToShare) {
      throw new ForbiddenException("This dataset is not found or is already set to ready to share!");
    }

    if (!(currentUserId in dataset.managerIds)) {
      throw new ForbiddenException('Only managers can modify this dataset!');
    }

    const updateDataset = this.datasetModel.update({
      data: {
        isReadyToShare: true
      }, where: {
        id: datasetId
      }
    })
    return await this.prisma.$transaction([updateDataset])
  }

  private primaryKeyCheck(primaryKeys: string[], df: pl.DataFrame): boolean {
    for (let key of primaryKeys) {
      const col = df.getColumn(key);
      if (col.nullCount() > 0) {
        return false
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const checkPrimaryKeysArray: boolean[] = df.select(...primaryKeys).isUnique().toArray();
    return checkPrimaryKeysArray.reduce((prev, curr) => prev && curr);
  }
}
