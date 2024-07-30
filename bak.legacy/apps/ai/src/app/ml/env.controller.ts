import { Controller, Logger, Scope } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { PredictEnvOptionsDto, PredictOptionsDto } from '@libs/models/ai'

import { ModelService } from './model.service';

@Controller({scope: Scope.REQUEST})
export class EnvController {
  constructor(private modelService: ModelService) {}

  @MessagePattern('ai.predict')
  async predict(@Payload() data: PredictOptionsDto, @Ctx() context: RedisContext) {
    Logger.debug(`channel: ${context.getChannel()}, data: ${JSON.stringify(data)}`);
    return await this.modelService.predict(data);
  }

  @MessagePattern('ai.predictEnv')
  async predictEnv(@Payload('body') data: PredictEnvOptionsDto, @Ctx() context: RedisContext) {
    Logger.debug(`channel: ${context.getChannel()}, data: ${JSON.stringify(data)}`);
    return await this.modelService.predictEnv(data);
  }
}
