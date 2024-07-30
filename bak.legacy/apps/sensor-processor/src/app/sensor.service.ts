import { DbService } from "@libs/db/db.service";
import { Device, SdhCultureMedium, SdhExternal, SdhInternal } from "@libs/db";
import { DateUtils } from "@libs/utils";
import { Injectable, Logger } from "@nestjs/common";
import { DataSource } from "typeorm";
import { AbstractSensor } from "./sensors/abstract-sensor";

@Injectable()
export class SensorService {
  devices:Device[] = []; 
  lastSensingDts = new Map<string, Date>(); // db-serial, sensingDt

  loadAllDevicesPromise: Promise<void>;
  entities = [Device, SdhInternal, SdhExternal, SdhCultureMedium ];

  constructor( private dbService: DbService) {
    this.loadAllDevicesPromise = this.loadAllDevices();
  }

  async loadAllDevices() {
    this.devices = [];
    const conn = await this.dbService.getDataSource();
    const deviceRepo = conn.getRepository(Device);

    const r = await deviceRepo.find();
    this.devices.push(...r);
  }

  /**
   * get device by serial
   * @param serial 
   * @param commValue 
   * @returns 
   */
  getDeviceBySerial(serial) {
    const device = this.devices.find(d => d.serial == serial);
    return device;
  }

  async saveSensorData(sensors: AbstractSensor[]) {
    for (const sensor of sensors) {
      const device = this.getDeviceBySerial(sensor.serial);
      if (!device) {
        Logger.debug("No matching device. Serial: " + sensor.serial);
        return;
      }

      const dataSource = await this.dbService.getDataSource();
      const lastSensingDtKey = sensor.serial;

      let sensingDt;

      for (const entity of sensor.getEntities()) {
        if (!entity) continue;

        if (!entity.validate()) {
          Logger.warn(`Not valid sensor data. ${sensor.serial} ${JSON.stringify(entity)}`);
          continue;
        }

        // 해당 device의 마지막 sensingdt보다 같거나 과거이면 스킵
        const lastSensingDt = this.lastSensingDts.get(lastSensingDtKey);
        if (lastSensingDt && entity.sensingDt <= lastSensingDt) {
          Logger.debug(`Skip past data: ${sensor.serial}, ${DateUtils.format(entity.sensingDt)}`);
          continue;
        }

        // sensor data의 entities에서 가장 최근 시각으로 sensingDt를 설정
        if (!sensingDt || sensingDt < entity.sensingDt) {
          sensingDt = entity.sensingDt;
        }

        entity.deviceIdx = device.idx;

        try {
          if (entity instanceof SdhInternal) {
            await this.saveInternal(dataSource, entity);

          } else if (entity instanceof SdhExternal) {
            await this.saveExternal(dataSource, entity);

          } else if (entity instanceof SdhCultureMedium) {
            await this.saveCulture(dataSource, device, entity);
          }
        } catch (e) {
          Logger.error("Error on save data", e);
        }
      }

      this.lastSensingDts.set(lastSensingDtKey, sensingDt);
      await this.updateDevice(dataSource, device, sensingDt);
    }

  }

  async saveInternal(dataSource: DataSource, entity:SdhInternal) {
    // TODO: need real lat, long
    const latitude = 36.882;
    const longitude = 126.241;

    const [sunrise, sunset] = DateUtils.getSunriseSunset(entity.sensingDt, latitude, longitude);
    entity.isSunrise = entity.sensingDt >= sunrise && entity.sensingDt <= sunset;
    const sdhInternalRepo = dataSource.getRepository(SdhInternal);
    const res = await sdhInternalRepo.save(entity);
  }

  async saveExternal(dataSource: DataSource, entity:SdhExternal) {
    const sdhExternalRepo = dataSource.getRepository(SdhExternal);
    const res = await sdhExternalRepo.save(entity);
  }

  async saveCulture(dataSource: DataSource, device: Device, entity:SdhCultureMedium) {
    // TODO: need real lat, long
    const latitude = 36.882;
    const longitude = 126.241;

    const [sunrise, sunset] = DateUtils.getSunriseSunset(entity.sensingDt, latitude, longitude);
    entity.isSunrise = entity.sensingDt >= sunrise && entity.sensingDt <= sunset;

    const sdhCultureRepo = dataSource.getRepository(SdhCultureMedium);
    const res = await sdhCultureRepo.save(entity);
  }

  /**
   * lastReportDt, commError 를 세팅하고 db에 업데이트 한다
   * @param dataSource
   * @param device 
   */
  async updateDevice(dataSource: DataSource, device: Device, sensingDt: Date) {
    device.lastReportDt = sensingDt;
    device.commError = false;
    const repo = dataSource.getRepository(Device);
    await repo.update(device.idx, {commError: false, lastReportDt: device.lastReportDt,
      ...(!device.firstReportDt && {firstReportDt: sensingDt})
    });
    if (!device.firstReportDt) device.firstReportDt = sensingDt;
    Logger.debug("Update device: " + JSON.stringify(device));
  }
}