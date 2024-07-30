import { Device, Dong, TENANT } from '@libs/db';
import { DeviceLocation, DeviceModel } from '@libs/db/sensor';
import { CreateDeviceDto, DeviceFarmRequestDto } from '@libs/models';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { DataSource, FindManyOptions, IsNull, Repository } from 'typeorm';

@Injectable()
export class DeviceService {
  constructor(
    @InjectDataSource(TENANT) private dataSource: DataSource,
    @InjectRepository(Device, TENANT) private deviceRepo: Repository<Device>,
    @InjectRepository(DeviceModel, TENANT) private deviceModelRepo: Repository<DeviceModel>,
    @InjectRepository(DeviceLocation, TENANT) private deviceLocationRepo: Repository<DeviceLocation>,
    @InjectRepository(Dong, TENANT) private dongRepo: Repository<Dong>,
  ) {
  }

  getDeviceModels() {
    return this.deviceModelRepo.find();
  }

  async getDevices(data: any) {
    const options: FindManyOptions<Device> = {
      relations: ['model'],
      where: {deleteDt: IsNull()}
    };

    if (data.idx) {
      options['where']['idx'] = data.idx;
    }

    const res = await this.deviceRepo.find(options);
    return res;
  }

  async getDeviceByIdx(data: any) {
    if(!data.idx) return;

    const found = await this.deviceRepo.findOne({
      relations: ['model'],
      where: { idx: data.idx }
    });
    const { modelIdx: modelCd, use, useRegDt, useFarmDongIdx, serialNumber, model } = found;
    const newModel = this.splitCategory(model.sensorNm);

    return { modelCd, use, useRegDt, useFarmDongIdx, serialNumber, newModel };
  }

  splitCategory(param: string){
    return param
      .split("),")
      .map(item => {
          return {
              deviceType: item.split("(")[0].replace(/\s/g, ""),
              sensorName: item.split("(")[1].replace(/[()]/g, "")
          };
      });
  }

  saveDevice(device: CreateDeviceDto) {
    const entity = plainToInstance(Device, device);
    return this.deviceRepo.save(entity);
  }

  async saveFarm(device: DeviceFarmRequestDto) {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // 1. 기존 deviceIdx를 가진 dong에서 데이터 지우기
      let promises = [];
      promises.push(
        this.dongRepo.createQueryBuilder()
          .update()
          .set({inDeviceIdx: null})
          .where("inDeviceIdx = :deviceIdx", { deviceIdx: device.deviceIdx})
          .execute()
      );

      promises.push(
        this.dongRepo.createQueryBuilder()
          .update()
          .set({exDeviceIdx: null})
          .where("exDeviceIdx = :deviceIdx", { deviceIdx: device.deviceIdx})
          .execute()
      );

      promises.push(
        this.dongRepo.createQueryBuilder()
          .update()
          .set({cmDeviceIdx: null})
          .where("cmDeviceIdx = :deviceIdx", { deviceIdx: device.deviceIdx})
          .execute()
      );

      await Promise.all(promises);

      // 2. 새 값으로 업데이트
      promises = [];
      if (device.inDongIdxes && device.inDongIdxes.length > 0) {
        promises.push(
          this.dongRepo.createQueryBuilder()
            .update()
            .set({inDeviceIdx: device.deviceIdx})
            .where("idx in (:dongIdxes)", { dongIdxes: device.inDongIdxes})
            .execute()
        );
      }

      if (device.exDongIdxes && device.exDongIdxes.length > 0) {
        promises.push(
          this.dongRepo.createQueryBuilder()
            .update()
            .set({exDeviceIdx: device.deviceIdx})
            .where("idx in (:dongIdxes)", { dongIdxes: device.exDongIdxes})
            .execute()
        );
      }

      if (device.cmDongIdxes && device.cmDongIdxes.length > 0) {
        promises.push(
          this.dongRepo.createQueryBuilder()
            .update()
            .set({cmDeviceIdx: device.deviceIdx})
            .where("idx in (:dongIdxes)", { dongIdxes: device.cmDongIdxes})
            .execute()
        );
      }

      await Promise.all(promises);
      await qr.commitTransaction();

    } catch (e) {
      await qr.rollbackTransaction();
      throw new Error('Failed to save farm device.');
    }

    return 'ok';
  }

  deleteDevice(idx: number) {
    return this.deviceRepo.update({idx}, {deleteDt: new Date()});
  }

  /**
   * 외부기상대의 device
   * @param deviceIdx
   */
  getLocation(deviceIdx: number) {
    return this.deviceLocationRepo.findOne({where: { deviceIdx }});
  }
}
