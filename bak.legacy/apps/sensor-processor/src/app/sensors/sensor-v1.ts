import { CreateSensorDataDto, SensorJobDataDto } from "@libs/models/sensor";
import { AbstractSensor } from "./abstract-sensor";
import * as UrlPattern from 'url-pattern';

import { SdhCultureMedium, SdhExternal, SdhInternal } from '@libs/db';
import { CalcUtils } from "@libs/utils";
import { Logger } from "@nestjs/common";

export class SensorV1 extends AbstractSensor {
  static urlPattern = new UrlPattern('/device/sensing');

  internal: SdhInternal;
  external: SdhExternal;
  cultureMedium: SdhCultureMedium;

  origin?: string;

  constructor(data: CreateSensorDataDto) {
    super();
    this.key = data.key;
    this.serial = data.serial;

    this.internal = this.createInternal(data);
    this.external = this.createExternal(data);
    this.cultureMedium = this.createCulture(data);
    this.origin = data.origin;
  }

  public static isMatched(data: SensorJobDataDto) {
    return SensorV1.parseUrl(data.originalUrl) != null;
  }

  static parseUrl(url: string) {
    return SensorV1.urlPattern.match(url);
  }

  static create(data: SensorJobDataDto) {
    let sensorData: CreateSensorDataDto[];
    if (Array.isArray(data.body)) {
      sensorData = data.body as CreateSensorDataDto[];
    } else {
      sensorData = [data.body as CreateSensorDataDto];
    }
    // const sensorData = data.body as CreateSensorDataDto;
    const ss: SensorV1[] = [];
    for (const sd of sensorData) {
      // TODO: 이름 바꾸기 전 임시 코드
      if (!sd.sensingDt && sd.sensingDT) {
        sd.sensingDt = sd.sensingDT;
      }
      const s = new SensorV1(sd);
      ss.push(s);
    }

    return ss;
  }

  createInternal(sensorData: CreateSensorDataDto) {
    const nn = CalcUtils.nanToNull;
    const internal = sensorData.internal;
    if (!internal) {
      return null;
    }
    const status = this.hex2dec(internal.status);
    if (status > 0) {
      Logger.warn(`${sensorData.serial} Internal sensor error(${internal.status})`);
      return null;
    }

    const entity = new SdhInternal();
    entity.sensingDt = new Date(sensorData.sensingDt);
    entity.temp = nn(internal.dryBulbTemp);
    entity.wetBulbTemp = nn(internal.wetBulbTemp); 
    entity.humidity = nn(internal.humidity);
    entity.co2 = nn(internal.co2);
    entity.solarRadiation = nn(internal.solarRadiation);

    return entity;
  }

  createExternal(sensorData: CreateSensorDataDto) {
    const nn = CalcUtils.nanToNull;
    const external = sensorData.external;
    if (!external) {
      return null;
    }
    const status = this.hex2dec(external.status);
    if (status > 0) {
      Logger.warn(`${sensorData.serial} External sensor error(${external.status})`);
      return null;
    }

    const entity = new SdhExternal();
    entity.sensingDt = new Date(sensorData.sensingDt);
    entity.temp = nn(external.temp);
    entity.humidity = nn(external.humidity);
    entity.rain = (external.rain === 'true') || (external.rain === true);
    entity.rainFall = nn(external.rainfall);
    entity.solarRadiation = nn(external.solarRadiation);
    entity.windSpeed = nn(external.windSpeed);
    const winDir = external.windDirection;
    entity.windDirection = winDir == null ? null : winDir + "";

    return entity;
  }

  createCulture(sensorData: CreateSensorDataDto) {
    const nn = CalcUtils.nanToNull;
    const cm = sensorData.cultureMedium
    if (!cm) {
      return null;
    }
    const status = this.hex2dec(cm.status);
    if (status > 0) {
      Logger.warn(`${sensorData.serial} CultureMedium sensor error(${cm.status})`);
      return null;
    }

    const entity = new SdhCultureMedium();
    entity.sensingDt = new Date(sensorData.sensingDt);
    entity.temp = nn(cm.temp);
    entity.moistureContent = nn(cm.moistureContent);
    entity.ph = nn(cm.ph);
    entity.ec = nn(cm.ec);

    return entity;
  }

  getEntities() {
    return [this.internal, this.external, this.cultureMedium];
  }

  hex2dec(hex: string|number) {
    if (typeof hex == "string")
      return parseInt(hex, 16); 
    return hex;
  }

}