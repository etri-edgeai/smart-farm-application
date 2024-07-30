import * as UrlPattern from 'url-pattern';

import { SdhBase, SdhCultureMedium, SdhExternal, SdhInternal } from '@libs/db';
import { CreateCultureMediumOldDto, CreateExternalEnvOldDto, CreateInternalEnvOldDto, CreateSensorDataOldDto, SensorJobDataDto } from "@libs/models/sensor";
import { AbstractSensor } from "./abstract-sensor";

export class SensorOld extends AbstractSensor {
  static urlPattern = new UrlPattern('/connfarm/api/device/:serial/sensor/:type.json');

  type: string;
  entity: SdhBase;

  constructor(data: SensorJobDataDto) {
    super();

    const {serial, type} = SensorOld.parseUrl(data.originalUrl);
    this.serial = serial;
    this.type = type;
    const body = data.body as CreateSensorDataOldDto;

    switch(this.type) {
      case 'internalEnv':
        this.entity = this.createInternal(type, body.internalEnv);
        break;
      case 'externalEnv':
        this.entity = this.createExternal(type, body.externalEnv);
        break;
      case 'cultureMedium':
        this.entity = this.createCulture(type, body.cultureMedium);
        break;
    }
  }

  public static create(data) {
    return [new SensorOld(data)];
  }
  
  public static isMatched(data: SensorJobDataDto) {
    return SensorOld.parseUrl(data.originalUrl) != null;
  }

  static parseUrl(url: string) {
    return SensorOld.urlPattern.match(url);
  }

  createInternal(type: string, internal: CreateInternalEnvOldDto) {
    const entity = new SdhInternal();
    entity.sensingDt = new Date(internal.sensingDt);
    entity.temp = internal.dryBulbTemp;
    entity.wetBulbTemp = internal.wetBulbTemp;
    entity.humidity = internal.humidity;
    entity.co2 = internal.co2;

    entity.solarRadiation = internal.solarRadiation;

    return entity;
  }

  createExternal(type: string, external: CreateExternalEnvOldDto) {
    const entity = new SdhExternal();
    entity.sensingDt = new Date(external.sensingDt);
    entity.temp = external.temp;
    entity.humidity = external.humidity;
    entity.rainFall = external.rain;
    entity.solarRadiation = external.solarRadiation;
    entity.windSpeed = external.windSpeed;
    entity.windDirection = external.windDirection;

    return entity;
  }

  createCulture(type: string, cm: CreateCultureMediumOldDto) {
    const entity = new SdhCultureMedium();
    entity.sensingDt = new Date(cm.sensingDt);
    entity.temp = cm.temp;
    entity.moistureContent = cm.moistureContent;
    entity.ph = cm.ph;
    entity.ec = cm.ec;

    return entity;
  }

  getEntities() {
    return [this.entity];
  }

}