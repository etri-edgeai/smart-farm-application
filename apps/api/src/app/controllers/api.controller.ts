import { BadRequestException, Controller, Get, Inject, Post, Req, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices'
import { Request } from 'express';
import { Logger } from "@nestjs/common";
import { CommService } from '@libs/comm';
import { MakeJsonResponseInterceptor } from '../interceptors/make-json-response.interceptor';
import { SensorService } from './sensor.service';

@UseInterceptors(MakeJsonResponseInterceptor)
@Controller()
export class ApiController {
  constructor(@Inject('REDIS') private redis: ClientProxy, private commService: CommService, private sensorService: SensorService) {}

  @Post('/bee-live')
  beeLive(@Req() req: Request) {
    console.log(req);
  }

  /**
   * @deprecated old fashion
   * @param req
   * @returns
   */
  @Post('/api/cmd.json')
  async postCmd(@Req() req: Request) {
    // 신버전의 cmd와 구버전의 command를 모두 지원
    const body = req.body;
    const cmd = body['cmd'] || body['command'];
    if (!cmd) {
      throw new BadRequestException('No request data');
    }

    Logger.debug('POST /api/cmd.json ' + JSON.stringify(body));
    return await this.commService.sendOldRequest(req, cmd);
  }

  @Get('/api/:module/:param1?/:param2?')
  async getApi(@Req() req: Request) {
    return await this.commService.sendRequest(req);
  }

  @Post('/api/:module/:param1?/:param2?')
  async postApi(@Req() req: Request) {
    const res = await this.commService.sendRequest(req);
    return res;
  }

  @Post('/connfarm/api/:module/:param1?/:param2?')
  async postApiOld(@Req() req: Request) {
    return await this.commService.sendRequest(req);
  }

  @Get('/timestamp')
  timestamp() {
    return new Date().toISOString();
  }
}
