import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { CommonConfigModule, CommonConfigService } from '@libs/config';
import { CommModule } from '@libs/comm';
import { ApiController } from './controllers/api.controller';
import { SensorController } from './controllers/sensor.controller';
import { SensorService } from './controllers/sensor.service';
import { FrontendMiddleware } from './middlewares/frontend.middleware';

@Module({
  imports: [
    HttpModule,
    BullModule.forRootAsync({
      useFactory: (config: CommonConfigService) => ({ redis: config.redis, defaultJobOptions: {
        removeOnComplete: true, removeOnFail: true, timeout: 12 * 60 * 60 * 1000
      }}),
      inject: [CommonConfigService]
    }),
    BullModule.registerQueue({ name: 'sensor' }),
    CommonConfigModule,
    CommModule
  ],
  controllers: [SensorController, ApiController], // SensorController 우선권을 가지기 위해 순서가 바뀌면 안됨
  providers: [SensorService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(FrontendMiddleware).forRoutes(
      { path: '*', method: RequestMethod.ALL },
    );
  }
}
