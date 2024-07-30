export class CreateSensorDataOldDto {
    internalEnv?: CreateInternalEnvOldDto;
    externalEnv?: CreateExternalEnvOldDto;
    cultureMedium?: CreateCultureMediumOldDto;
}

export class CreateInternalEnvOldDto {
  sensingDt: string;
  temp: number;
  dryBulbTemp: number;
  wetBulbTemp: number;
  humidity?: number;
  relative_humidity?: number;
  co2: number;
  lightness: number;
  solarRadiation: number;
  illuminance: number;
}

export class CreateExternalEnvOldDto {
  //@Type(() => Date)
  sensingDt: string;
  temp: number;
  humidity: number;
  /** 강우량 */
  rain?: number;
  windSpeed?: number;
  lightness?: number;
  solarRadiation?: number;
  windDirection?: string;
}

export class CreateCultureMediumOldDto {
  sensingDt: string;
  temp: number;
  ec: number;
  moistureContent: number;
  ph: number;
}