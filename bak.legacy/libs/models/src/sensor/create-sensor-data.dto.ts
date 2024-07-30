export class CreateSensorDataDto {
  serial: string;
  hwVer?: string;
  fwVer?: string;
  protocolVer?: string;
  //@Type(() => Date)
  sensingDt?: string;
  sensingDT?: string;
  internal?: CreateInternalEnvDto;
  external?: CreateExternalEnvDto;
  cultureMedium?: CreateCultureMediumDto;
  origin?: string;
  key?: string;
}

export class CreateInternalEnvDto {
  status:number|string = "0x0";
  dryBulbTemp: number;
  wetBulbTemp: number;
  humidity?: number;
  co2: number;
  solarRadiation: number;
}

export class CreateExternalEnvDto {
  status:number|string = "0x0";
  temp: number;
  humidity: number;
  solarRadiation?: number;
  windDirection?: number; // 0 ~ 359
  windSpeed?: number;
  rain?: boolean | string;
  rainfall?: number;
}

export class CreateCultureMediumDto {
  //status:number|string = "0x0";
  status:number|string = 4;
  temp: number;
  moistureContent: number;
  ec: number;
  ph: number;
}

/*
export enum InternalIdx {
  sensingDt, status, dryBulbTemp, wetBulbTemp, humidity, co2, solarRadiation
}
export enum ExternalIdx {
  sensingDt, status, temp, humidity, solarRadiation, windDirection, windSpeed, rain, rainfall
}
export enum CultureMediumIdx {
  sensingDt, status, temp, moistureContent, ec, ph
}
*/
