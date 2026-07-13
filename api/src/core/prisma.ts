import { ConfigService, LibnestPrismaExtension } from '@douglasneuroinformatics/libnest';
import type { PrismaModuleOptions } from '@douglasneuroinformatics/libnest';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async create() {
    const client = new PrismaClient({
      datasourceUrl: this.getConnectionUrl()
    }).$extends(LibnestPrismaExtension);
    await client.$connect();
    return { client } satisfies PrismaModuleOptions;
  }

  private getConnectionUrl(): string {
    const mongoUri = this.configService.get('MONGO_URI');
    const env = this.configService.get('NODE_ENV');
    const url = new URL(`${mongoUri.href}/data-bank-${env}`);
    const params = {
      directConnection: this.configService.get('MONGO_DIRECT_CONNECTION'),
      replicaSet: this.configService.get('MONGO_REPLICA_SET'),
      retryWrites: this.configService.get('MONGO_RETRY_WRITES'),
      w: this.configService.get('MONGO_WRITE_CONCERN')
    };
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        url.searchParams.append(key, String(value));
      }
    }
    return url.href;
  }
}

export type RuntimePrismaClient = Awaited<
  ReturnType<(typeof PrismaModuleOptionsFactory)['prototype']['create']>
>['client'];
