import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Request } from 'express';
import { SensorJobDataDto } from '@libs/models';
import { CommService } from '@libs/comm';

@Injectable()
export class SensorService {
  constructor(@InjectQueue('sensor') private sensorQueue: Queue<SensorJobDataDto>, private commService: CommService) { }

  async addToQueue(req: Request, isNew = true) {
    const originalUrl = req.originalUrl;
    let headers = CommService.getSimpleHeaders(req);
    let body = await this.commService.getJsonBody(req);

    await this.sensorQueue.add({originalUrl, headers, body});
    const oldNew = isNew ? "New" : "Old";
    const url = isNew ? "" : originalUrl;
    Logger.debug(`Added to queue(${oldNew}): ${url} ${JSON.stringify(CommService.getSimpleHeaders(req))} ${JSON.stringify(body)}`);

    return 'success';
  }
}
