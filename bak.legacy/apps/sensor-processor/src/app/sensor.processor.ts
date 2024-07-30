import { SensorJobDataDto } from '@libs/models/sensor';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { SensorService } from './sensor.service';
import { ForwardService } from './forward/forward.service';
import { SensorFactory } from './sensors/sensor.factory';

@Injectable()
@Processor('sensor')
export class SensorProcessor implements OnApplicationShutdown {
  currentJob: Job<SensorJobDataDto>;

  constructor(
    @InjectQueue("sensor") private sensorQueue: Queue,
    private dbService: SensorService,
    private forwardService: ForwardService,
    ) {
    // this.sensorQueue.empty();

    this.sensorQueue.pause().then(() => {
      Logger.debug("sensorQueue paused!");
      this.dbService.loadAllDevicesPromise.then(async () => {
        await this.sensorQueue.resume();
        Logger.debug("sensorQueue resumed!");
      });
    });
  }

  async onApplicationShutdown() {
    await this.sensorQueue.pause();
    await this.currentJob.finished();
  }

  @Process()
  async handleTranscode(job: Job<SensorJobDataDto>) {
    this.currentJob = job;
    try {
      Logger.debug("Take from queue: " + JSON.stringify(job.data));
      const sensor = SensorFactory.create(job.data);

      this.forwardService.forward(sensor, job.data);
      await this.dbService.saveSensorData(sensor);

    } catch (e) {
      Logger.error("url:" + job.data.originalUrl + ", body: " + JSON.stringify(job.data.body) + "\n", e);
    }
  }

}