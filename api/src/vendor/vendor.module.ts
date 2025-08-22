import { ConfigService } from '@douglasneuroinformatics/libnest';
import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';

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
  ]
})
export class VendorModule {}
