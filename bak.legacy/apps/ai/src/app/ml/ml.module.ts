import { Module } from '@nestjs/common';
import { EnvController } from './env.controller';
import { PestController } from './pest.controller';
import { ModelService } from './model.service';

@Module({
  controllers: [EnvController, PestController],
  providers: [ModelService]
})
export class MlModule {}
