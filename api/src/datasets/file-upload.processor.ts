import fs from 'fs';

import { LoggingService } from '@douglasneuroinformatics/libnest';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ForbiddenException, UnprocessableEntityException } from '@nestjs/common';
import { Job } from 'bullmq';
import { pl } from 'nodejs-polars';
import type { DataFrame } from 'nodejs-polars';

import { TabularDataService } from '@/tabular-data/tabular-data.service';

import { FileUploadQueueName } from './datasets.constants';
import { DatasetsService } from './datasets.service';

@Processor(FileUploadQueueName)
export class FileUploadProcessor extends WorkerHost {
  constructor(
    private readonly datasetsService: DatasetsService,
    private readonly tabularDataService: TabularDataService,
    private readonly logger: LoggingService
  ) {
    super();
  }

  async process(job: Job) {
    type FileUploadJobData = {
      datasetId: string;
      filePath?: string;
      isJSON: boolean;
      primaryKeys: string;
      uploadedString?: string;
    };
    const jobData: FileUploadJobData = job.data as FileUploadJobData;
    let csvString: string;
    let df: DataFrame;
    let separator = ',';
    if (jobData.uploadedString) {
      // process uploaded string
      csvString = jobData.uploadedString;
    } else if (jobData.filePath) {
      // process uploaded file
      const file = await fs.promises.readFile(jobData.filePath);
      separator = jobData.filePath?.endsWith('.tsv') ? '\t' : ',';
      csvString = file.toString(); // polars has a bug parsing tsv, this is a hack for it to work
    } else {
      throw new ForbiddenException('Cannot handle job without uploaded string and uploaded file!');
    }
    if (jobData.isJSON) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      df = pl.readJSON(JSON.stringify(JSON.parse(csvString).data));
    } else {
      df = pl.readCSV(csvString, { quoteChar: '"', sep: separator, tryParseDates: true });
      // df = pl.readJSON(JSON.stringify(typedObjs));
    }

    try {
      // prepare the primary keys array
      if (jobData.primaryKeys) {
        const primaryKeysArray = jobData.primaryKeys.split(',').map((key) => key.trim());
        await this.tabularDataService.create(df, jobData.datasetId, primaryKeysArray);
      } else {
        await this.tabularDataService.create(df, jobData.datasetId, []);
      }
      await this.datasetsService.updateDatasetStatus(jobData.datasetId, 'Success');
    } catch (error) {
      this.logger.error(`Error processing file upload: ${(error as Error).message}`, error, FileUploadProcessor.name);
      await this.datasetsService.updateDatasetStatus(jobData.datasetId, 'Fail');
      throw new UnprocessableEntityException(`Cannot create dataset: ${(error as Error).message}`);
    }
  }
}
