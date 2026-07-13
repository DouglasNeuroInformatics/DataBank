import { ConfigService } from '@douglasneuroinformatics/libnest';
import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';

import { FastifyMultipartInitializer } from './fastify-multipart.initializer.js';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          connection: {
            host: configService.get('VALKEY_HOST'),
            port: configService.get('VALKEY_PORT')
          }
        };
      }
    })
  ],
  providers: [FastifyMultipartInitializer]
})
export class VendorModule {}
