/**
 * 통신 프로토콜
 */
export enum CommType {
  DEFAULT = 1,
  REST_API = 2,
  GREENCS = 3,
  WOOSUNG = 4,
  NMS = 5,
  KMA = 6,
  KYONONG = 11
};

/*
export const CommType = {
  DEFAULT: 1,
  REST_API: 2,
  GREENCS:3,
  WOOSUNG: 4,
  NMS: 5,
  KMA: 6,
  KYONONG: 11
};
*/

export class DeviceDto {
  idx: number;
  serialNumber: string;
  error: boolean;
  commType: CommType;
  commValue: string;
  firstReportDt: Date;
  lastReportDt: Date;
  modelIdx: number;
  formatIdx: number;
  reportPeriod: number;
  enabled: boolean;
  createDt: Date;
  updateDt: Date;
  deleteDt: Date;
}

export class CreateDeviceDto {
  idx?: number;
  serialNumber: string;
  commType: CommType;
  commValue: string;
  modelIdx: number;
  formatIdx: number;
  reportPeriod: number;
}

export class DeviceFarmRequestDto {
  deviceIdx: number;
  inDongIdxes: number[];
  exDongIdxes: number[];
  cmDongIdxes: number[];
}
