import { PestPredictRequestDto } from '@libs/models/ai';
import { Controller, Logger } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { KbService } from './kb.service';

@Controller()
export class KbController {
  constructor(private kbService: KbService) {}

  @MessagePattern('ai.predictPest')
  async predictEnv(@Payload('body') data: PestPredictRequestDto, @Ctx() context: RedisContext) {
    Logger.debug(`channel: ${context.getChannel()}, data: ${JSON.stringify(data)}`);
    return await this.kbService.predictPest(data);
  }
}
