import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EMPTY } from 'rxjs';

import { COMMON, Forward } from '@libs/db';
import { SensorJobDataDto } from '@libs/models/sensor';
import { AbstractSensor } from '../sensors/abstract-sensor';

@Injectable()
export class ForwardService implements OnModuleInit {
  hosts = new Map<string, RegExp[]>(); // host, serial patterns

  constructor(
    private httpService: HttpService,
    @InjectRepository(Forward, COMMON) private fowardRepository: Repository<Forward>
    ) { }
  
  async onModuleInit() {
    await this.loadForward();
  }

  async loadForward() {
    const forwards = await this.fowardRepository.find({where: {enabled: true}});
    this.hosts.clear();

    for (const f of forwards) {
      try {
        const serials = f.serials.split(", ").map(s => new RegExp(s));
        this.hosts.set(f.host, serials);
      } catch (e) {
        Logger.error(`Invalid regular expression for forwarding info: ${f.serials}`);
      }
    }

    Logger.log(`Forward info loaded: ${this.hosts.size} entries`);
  }

  async forward(sensors: AbstractSensor[], data: SensorJobDataDto) {
    for (const sensor of sensors) {
      for (const entry of this.hosts.entries()) {
        for (const reg of entry[1]) {
          if (reg.test(sensor.serial)) {
            const url = entry[0] + data.originalUrl;
            Logger.debug(`Forwarding: ${url}, ${JSON.stringify(data.body)}`);

            // TODO: IncomingHttpHeaders 에서 AxiosHttpHeaders로 casting이 안되어 아래와 같이 처리. 다음 axios 버전에선 해결될 것
            /*
            const headers = {};
            for (const [key, value] of Object.entries(data.headers)) {
              headers[key] = value;
            }
            */
            const headers = {};
            if (data.headers['x-real-ip']) {
              headers['X-Real-IP'] = data.headers['x-real-ip'];
            }

            this.httpService.post(url, data.body, {headers: headers, timeout: 3000}).subscribe({
              next: r => {
                Logger.debug(`Forwarded: ${sensor.serial}, ${r.data}`);
              },
              error: e => {
                Logger.warn(`Failed to forward: ${sensor.serial}, ${e.message}(${url})`);
                return EMPTY;
              }
            });

            break;
          }
        }
      }
    }
  }
}
