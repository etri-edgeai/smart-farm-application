import { SdhBase } from "@libs/db";

export abstract class AbstractSensor {
  key?: string;
  serial: string;
  // data: SensorJobDataDto;
/* 
  constructor(data: SensorJobDataDto) {
    this.data = data;
    this.create(data);
  }
  */

  //abstract create(data: SensorJobDataDto);
  abstract getEntities(): SdhBase[];
}