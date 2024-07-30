import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SdhExternal, SdhInternal } from "@libs/db/sensor";
import { PredictOptionsDto } from "@libs/models/ai";
import { Repository } from "typeorm";

@Injectable()
export class DbService {
  constructor(
    //@InjectConnection(TENANT) private readonly connection: Connection,
    @InjectRepository(SdhInternal) private sdhInternalRepo: Repository<SdhExternal>,
    @InjectRepository(SdhExternal) private sdhExternalRepo: Repository<SdhExternal>
  ) {
  }

  async loadExternalEnv(options: PredictOptionsDto) {
    // options.time 값이 있으면 사용하고 없으면 현재 시각으로
    let endTime;
    if (options.time) {
      endTime = new Date(options.time);
    } else {
      endTime = new Date();
    }

    const startTime = new Date(endTime);
    startTime.setDate(startTime.getDate() -2); // 48시간 데이터

    const q = this.sdhExternalRepo.createQueryBuilder()
      .select("sensing_dt", "sdt")
      .addSelect("sews_temp", "t")
      .addSelect("sews_humidity", "h")
      .where("device_idx = :deviceIdx AND sensing_dt BETWEEN :startTime AND :endTime")
      .setParameters({deviceIdx: options.deviceIdx, startTime: startTime, endTime: endTime});

    const sql = q.getSql();
    const ret = await q.getRawMany();

    return ret;
  }

  async loadInternalEnv(options: PredictOptionsDto) {
    // options.time 값이 있으면 사용하고 없으면 현재 시각으로
    let endTime;
    if (options.time) {
      endTime = new Date(options.time);
    } else {
      endTime = new Date();
    }

    const startTime = new Date(endTime);
    startTime.setDate(startTime.getDate() -2); // 48시간 데이터

    const q = this.sdhInternalRepo.createQueryBuilder()
      .select("sensing_dt", "sdt")
      .addSelect("sie_temp", "t")
      .addSelect("sie_humidity", "h")
      .addSelect("sie_co2", "co2")
      .addSelect("sie_hd", "hd")
      .where("device_idx = :deviceIdx AND sensing_dt BETWEEN :startTime AND :endTime")
      .setParameters({deviceIdx: options.deviceIdx, startTime: startTime, endTime: endTime});

    const sql = q.getSql();
    const ret = await q.getRawMany();

    return ret;
  }

}