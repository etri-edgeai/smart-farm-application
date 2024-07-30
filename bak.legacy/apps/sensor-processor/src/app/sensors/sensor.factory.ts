import { SensorJobDataDto } from "@libs/models/sensor";
import { SensorOld } from "./sensor-old";
import { SensorV1 } from "./sensor-v1";

export class SensorFactory {
  public static create(data: SensorJobDataDto) {
    if (SensorOld.isMatched(data)) {
      return SensorOld.create(data);
    }
    if (SensorV1.isMatched(data)) {
      return SensorV1.create(data);
    }

    throw new Error('Invalid sensor. No matching format.');
  }
}