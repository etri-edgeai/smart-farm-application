import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { CommonConfigModule, CommonConfigService } from '@libs/config';
import { COMMON, DbModule, typeormCommonOptions } from '@libs/db';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ForwardModule } from './forward/forward.module';
import { SensorProcessor } from './sensor.processor';
import { SensorService } from './sensor.service';
import { CommModule } from '@libs/comm';

@Module({
  imports: [HttpModule, CommonConfigModule, CommModule, ForwardModule, DbModule,
    TypeOrmModule.forRootAsync(typeormCommonOptions),
    BullModule.forRootAsync({
      useFactory: (config: CommonConfigService) => ({ redis: config.redis, defaultJobOptions: {
        removeOnComplete: true, removeOnFail: true, timeout: 12 * 60 * 60 * 1000 } }),
      inject: [CommonConfigService]
    }),
    BullModule.registerQueue({
      name: 'sensor'
    }),
  ],
  controllers: [AppController],
  providers: [AppService, SensorService, SensorProcessor],
})
export class AppModule {}
