import { Expose } from "class-transformer";

export class DongDto {
  @Expose()
  idx: number;
  @Expose()
  farmIdx: number;
  @Expose()
  no: number;
  @Expose()
  main: boolean;
  @Expose()
  inDeviceIdx: number;
  @Expose()
  exDeviceIdx: number;
  @Expose()
  cmDeviceIdx: number;
}