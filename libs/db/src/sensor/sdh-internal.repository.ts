import { DataSource } from "typeorm";
import { SdhInternal } from "./sdh-internal.entity";
import { DateUtils } from "@libs/utils/date.utils";

export const SdhInternalRepository = (dataSource: DataSource) => 
    dataSource.getRepository(SdhInternal).extend({
      async calcDailyStats(deviceId: number, date: Date) {
        const dayKey = DateUtils.toDayKey(date);
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);
        const dayKeyNext = DateUtils.toDayKey(nextDate);
    
        return await this.createQueryBuilder()
            .select(`AVG(CASE WHEN daykey = :dayKey THEN sie_temp ELSE NULL END)`, "tempAvgDay")
            // .addSelect(`AVG(CASE WHEN daykey = :dayKey THEN sie_temp ELSE NULL END)`, "tempAvgDay")
            .where("device_idx =:deviceId AND daykey BETWEEN :dayKey AND :dayKeyNext")
            .setParameters({deviceId: deviceId, dayKey: dayKey, dayKeyNext: dayKeyNext})
            .cache(60000)
            .getRawOne();
      }
    });

/* @EntityRepository(SdhInternal)
export class SdhInternalRepository extends Repository<SdhInternal> {

  async calcDailyStats(deviceId: number, date: Date) {
    const dayKey = DateUtils.toDayKey(date);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    const dayKeyNext = DateUtils.toDayKey(nextDate);

    return await this.createQueryBuilder()
        .select(`AVG(CASE WHEN daykey = :dayKey THEN sie_temp ELSE NULL END)`, "tempAvgDay")
        // .addSelect(`AVG(CASE WHEN daykey = :dayKey THEN sie_temp ELSE NULL END)`, "tempAvgDay")
        .where("device_idx =:deviceId AND daykey BETWEEN :dayKey AND :dayKeyNext")
        .setParameters({deviceId: deviceId, dayKey: dayKey, dayKeyNext: dayKeyNext})
        .cache(60000)
        .getRawOne();
  }
} */