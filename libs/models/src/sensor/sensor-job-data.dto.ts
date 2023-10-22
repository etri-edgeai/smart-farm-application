import { CreateSensorDataOldDto } from "./create-sensor-data-old.dto";
import { CreateSensorDataDto } from "./create-sensor-data.dto";

/**
 * api 모듈에서 queue에 넣는 sensor 데이터
 */
export class SensorJobDataDto {
  originalUrl: string;
  headers: any;
  body: CreateSensorDataOldDto | CreateSensorDataDto | CreateSensorDataDto[];
}
