import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@/core/decorators/inject-prisma-client.decorator';
import type { Model } from '@/prisma/prisma.types';

import type { GetTabularDataViewDto } from './zod/tabular-data';

@Injectable()
export class TabularDataService {
  constructor(@InjectModel('TabularData') private readonly tabularDataModel: Model<'TabularData'>) {}

  // create tabular dataset
  create(createTabularDataDto: string) {}

  // delete tabular dataset
  deleteById(tabularDataId: string) {
    return this.tabularDataModel.delete({
      where: {
        id: tabularDataId
      }
    });
  }
  async findById(tabularDataId: string) {
    const tabularData = await this.tabularDataModel.findUnique({
      where: {
        id: tabularDataId
      }
    });

    if (!tabularData) {
      throw new NotFoundException('Cannot find tabular data!');
    }

    return tabularData;
  }
  // getTabularDataView
  async getViewById(getTabularDataViewDto: GetTabularDataViewDto) {
    // get view dto should contain a list of columns
    const tabularData = await this.tabularDataModel.findUnique({
      include: {
        columns: {
          where: {
            id: { in: getTabularDataViewDto.columnIds }
          }
        }
      },
      where: {
        id: getTabularDataViewDto.tabularDataId
      }
    });

    if (!tabularData) {
      throw new NotFoundException(`Cannot find tabular data with id ${getTabularDataViewDto.tabularDataId}`);
    }
  }
  // update tabular dataset
  update(updateDatasetDto: string) {
    // can modify dataset
    // update
  }
}
