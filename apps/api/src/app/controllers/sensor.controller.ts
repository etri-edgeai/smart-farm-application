import { Controller, Logger, Post, Req, UseInterceptors } from '@nestjs/common';
import { MakeJsonResponseInterceptor } from './../interceptors/make-json-response.interceptor';
import { SensorService } from './sensor.service';
import { CommService } from '@libs/comm';

@UseInterceptors(MakeJsonResponseInterceptor)
@Controller()
export class SensorController {
  constructor(private commService: CommService, private sensorService: SensorService) { }

  // 구버전
  @Post('/connfarm/api/device/:idx/sensor/:type.json')
  oldSensor(@Req() req) {
    return this.sensorService.addToQueue(req, false);
  }

  // 신버전
  @Post('/device/sensing')
  sensing(@Req() req) {
    return this.sensorService.addToQueue(req);
  }

  @Post('/api/device/multisensing')
  async multiSensing(@Req() req) {
    const originalUrl = req.originalUrl;
    let body = await this.commService.getJsonBody(req);
    Logger.debug(`recieved: ${originalUrl} ${JSON.stringify(CommService.getSimpleHeaders(req))} ${JSON.stringify(body)}`);
    return 'success';
  }
}
