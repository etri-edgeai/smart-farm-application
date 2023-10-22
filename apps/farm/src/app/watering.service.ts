import { CommonConfigService } from '@libs/config';
import { DongVentWatering, SdhCultureMedium, SdhInternal, TENANT } from '@libs/db';
import { WateringReportDto } from '@libs/models';
import { DateUtils } from '@libs/utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, LessThan, Not, Repository } from 'typeorm';

enum WateringState {
  W, WD, D // watering, watering-drainage, drainage
}

class WateringDrainage {
  startTime: Date;
  endTime: Date;
  supplyWeight: number = 0;
  drainageWeight: number = 0;
  TranspirationPerMin: number = 0;
  hdLevel: number = 0;
}

@Injectable()
export class WateringService {
  constructor(
    private config: CommonConfigService,
    @InjectRepository(SdhInternal, TENANT) private sdhInternalRepo: Repository<SdhInternal>,
    @InjectRepository(SdhCultureMedium, TENANT) private sdhCmRepo: Repository<SdhCultureMedium>,
    @InjectRepository(DongVentWatering, TENANT) private fdVwRepo: Repository<DongVentWatering>
    ) { }

  async getWateringReport(farmDongIdx, inDeviceIdx, cmDeviceIdx, dayKey: number): Promise<WateringReportDto> {
    if (!farmDongIdx) {
      throw new BadRequestException("Invalid farmDongIdx");
    }
    const yDayKey = DateUtils.toDayKey(DateUtils.add(DateUtils.dayKeyToDate(dayKey), -1, 'd'));
    const aDayKey = DateUtils.toDayKey(DateUtils.add(DateUtils.dayKeyToDate(dayKey), -2, 'd'));
    const yWdPromise = this.getWateringDrainage(null, inDeviceIdx, cmDeviceIdx, yDayKey);
    const tWdPromise = this.getWateringDrainage(null, inDeviceIdx, cmDeviceIdx, dayKey);
    const yVwPromise = this.fdVwRepo.findOne({where:{dongIdx: farmDongIdx, dayKey: yDayKey}});
    const tVwPromise = this.fdVwRepo.findOne({where:{dongIdx: farmDongIdx, dayKey: dayKey}});
    const yMinMaxMcPromise = this.sdhCmRepo.createQueryBuilder().select('MIN(scm_moisture_content)', 'min')
      .addSelect('MAX(scm_moisture_content)', 'max')
      .where('device_idx = ' + cmDeviceIdx)
      .andWhere('dayKey = ' + yDayKey)
      .getRawOne();
    const tMinMaxMcPromise = this.sdhCmRepo.createQueryBuilder().select('MIN(scm_moisture_content)', 'min')
      .addSelect('MAX(scm_moisture_content)', 'max')
      .where('device_idx = ' + cmDeviceIdx)
      .andWhere('dayKey = ' + dayKey)
      .getRawOne();
    const aMinMaxMcPromise = this.sdhCmRepo.createQueryBuilder().select('MIN(scm_moisture_content)', 'min')
      .addSelect('MAX(scm_moisture_content)', 'max')
      .where('device_idx = ' + cmDeviceIdx)
      .andWhere('dayKey = ' + aDayKey)
      .getRawOne();
    
    const weightDiffPromise = this.getWeightDiff(cmDeviceIdx, dayKey);

    const [yWd, tWd, yVw, tVw, yMinMaxMc, tMinMaxMc, aMinMaxMc, weightDiff] =
      await Promise.all([yWdPromise, tWdPromise, yVwPromise, tVwPromise, yMinMaxMcPromise, tMinMaxMcPromise, aMinMaxMcPromise, weightDiffPromise]);
    
    let aMin = Number.POSITIVE_INFINITY;
    let tMin = Number.POSITIVE_INFINITY;
    let yMin = Number.POSITIVE_INFINITY;
    if (aMinMaxMc) {
      aMin = aMinMaxMc.min;
    }

    // 전일
    const report = new WateringReportDto();
    report.yDate = DateUtils.dayKeyToDate(yDayKey).toISOString();
    if (yWd && yWd.length > 0) {
      report.yTotalSupplyCount = yWd.length;
      report.yTotalSupply = yWd.reduce((acc, curr) => { return acc += curr.supplyWeight; }, 0);
      report.yTotalDrainage = yWd.reduce((acc, curr) => { return acc += curr.drainageWeight; }, 0);
      report.yFirstSupplyTime = yWd[0].startTime.toISOString();
    }
    if (yVw && yVw.wateringRecommendDt) {
      report.yWateringRecommendTime = yVw.wateringRecommendDt.toISOString();
    }
    if (yMinMaxMc) {
      report.yMinMoistureContent = yMinMaxMc.min;
      report.yMaxMoistureContent = yMinMaxMc.max;
      yMin = yMinMaxMc.min;
    }

    // 당일 
    report.tDate = DateUtils.dayKeyToDate(dayKey).toISOString();
    if (tWd && tWd.length > 0) {
      report.tFirstSupplyTime = tWd[0].startTime.toISOString();
    }
    if (tVw && tVw.wateringRecommendDt) {
      report.tWateringRecommendTime = tVw.wateringRecommendDt.toISOString();
    }
    if (tMinMaxMc) {
      report.tMinMoistureContent = tMinMaxMc.min;
      tMin = tMinMaxMc.min;
    }

    let count = 0;
    count += aMin > 0 ? 1: 0;
    count += yMin > 0 ? 1: 0;
    count += tMin > 0 ? 1: 0;
    report.lastThreeDaysMinMoistureContent = (aMin + yMin + tMin) / count;
    if (report.lastThreeDaysMinMoistureContent == Number.POSITIVE_INFINITY) {
      report.lastThreeDaysMinMoistureContent = undefined;
    } else {
      report.lastThreeDaysMinMoistureContent = +report.lastThreeDaysMinMoistureContent.toFixed(2);
    }

    report.weightDiff = weightDiff;

    return report;
  }

  async getSensor(dripperNum = 1, inDeviceIdx: number, cmDeviceIdx: number, dayKey: number) {
    const resPromise = this.sdhCmRepo.find({
      select: { sensingDt: true, temp: true, moistureContent: true, intakeEc: true,  weight: true, drainageWeight: true },
      where: { deviceIdx: cmDeviceIdx, dayKey: dayKey },
      order: { sensingDt: "ASC" }
    });

    // 분당 증산량을 구하기 위해 필요하다
    const resSupPromise = this.getWateringDrainage(dripperNum, inDeviceIdx, cmDeviceIdx, dayKey);

    const [res, resSup] = await Promise.all([resPromise, resSupPromise]);

    let supIdx = 0;
    for (let i = 1; i < res.length; i++) {
      const netDrainageWeight = (res[i].drainageWeight - res[i-1].drainageWeight);
      res[i]['netDrainageWeight'] = netDrainageWeight < 0 ? 0 : +netDrainageWeight.toFixed();
      // 물을 비울 때 순간 0에서 컵 무게만큼 늘어나는 것 계산 제외
      if (res[i - 1].drainageWeight < 10 && res[i].drainageWeight > 100) {
        res[i]['netDrainageWeight'] = 0;
      }
      res[i].supplyWeight = 0;
      if (supIdx >= resSup.length) continue;
      if (resSup[supIdx].startTime > res[i].sensingDt) continue;

      if (resSup[supIdx].endTime < res[i].sensingDt) {
        if (supIdx < resSup.length - 1) {
          supIdx++;
        }
      }

      if (res[i].weight - res[i-1].weight > 0) {
        let supplyWeight = ((res[i].weight - res[i-1].weight) + (res[i].drainageWeight - res[i-1].drainageWeight) + resSup[supIdx].TranspirationPerMin);
        res[i].supplyWeight = supplyWeight <= 0 ? 0 : +supplyWeight.toFixed();
      }
    }

    res.shift();

    return res;
  }

  /**
   * 해당 일자의 급배액 정보
   * @param dripperNum 
   * @param inDeviceIdx 
   * @param cmDeviceIdx 
   * @param dayKey 
   * @returns 
   */
  async getWateringDrainage(dripperNum = 1, inDeviceIdx: number, cmDeviceIdx: number, dayKey: number) {
    const res = await this.sdhCmRepo.find({
      select: { sensingDt: true, weight: true, drainageWeight: true },
      where: { deviceIdx: cmDeviceIdx, dayKey: dayKey, weight: Not(IsNull()),  drainageWeight: Not(IsNull()) },
      order: { sensingDt: "ASC" }
    });

    const wateringDrainages: WateringDrainage[] = [];
    // state machine pattern이 필요할까?
    let state = WateringState.D;
    let lastEndIdx = 0; // 이전 급액 종료 idx
    let noneStateWeightSum = 0;
    let noneStateWeightCount = 0;
    let avgWeightDecrease = 0;
    let wd: WateringDrainage;

    for (let i = 1; i < res.length; i++) {
      const pr = res[i-1];
      const cr = res[i];

      const isSlabWeightUp = cr.weight != null && pr.weight != null && cr.weight >= pr.weight + 10;
      const isDrainageWeightUp = cr.drainageWeight != null && pr.drainageWeight != null && cr.drainageWeight > pr.drainageWeight + 1;
      const lastState = state;

      // 1. 현재 급배액 상태가 어떤지 체크한다
      if (isSlabWeightUp) {
        if (isDrainageWeightUp) state = WateringState.WD;
        else state = WateringState.W;
      } else {
        state = WateringState.D;
      }

      // 2. 현재 상태에 따라 급배액값을 계산한다
      // 2-1. 이전에 D였는데 W나 WD로 바뀌면 새로운 급액의 시작
      if (lastState == WateringState.D && (state == WateringState.W || state == WateringState.WD)) {
        // 급수 직전의 증산 평균을 구한다
        lastEndIdx = (lastEndIdx < i - 10) ? i - 10 : lastEndIdx;
        noneStateWeightSum = (res[lastEndIdx].weight - res[i - 1].weight);
        noneStateWeightCount = i - 1 - lastEndIdx;
        if (noneStateWeightSum > 0) {
          avgWeightDecrease = noneStateWeightSum / noneStateWeightCount;
        } else {
          avgWeightDecrease = 0;
        }

        // 새로운 급배액을 만들어 array에 넣는다
        wd = new WateringDrainage();
        wd.startTime = res[i].sensingDt;
        wd.TranspirationPerMin = avgWeightDecrease;
        if (wateringDrainages.length > 0) {
          wateringDrainages[wateringDrainages.length - 1].endTime = res[i-1].sensingDt;
        }
        wateringDrainages.push(wd);
      }

      // 2-2. 배액값은 항상 계산해준다
      if (wd) {
        let ddw = res[i].drainageWeight - res[i - 1].drainageWeight;
        ddw = ddw > 0 ? ddw : 0;
        if (res[i - 1].drainageWeight < 10 && res[i].drainageWeight > 100) {
          ddw = 0;
        }
        let dsw = res[i].weight - res[i - 1].weight;
        dsw = dsw > 0 ? dsw : 0;
        wd.drainageWeight = wd.drainageWeight + ddw;

        // 2-3. W나 WD면 급액값을 만들어 넣는다
        if (state == WateringState.W || state == WateringState.WD) {
          wd.supplyWeight = wd.supplyWeight + dsw + ddw + avgWeightDecrease; // 증산까지 더함
          console.log(`${dsw} ${ddw} ${avgWeightDecrease}`);
        }
      }

      // 2-4. 이전에 W나 WD 였는데 지금 D 이면 급액 종료 처리
      if ((lastState == WateringState.W || lastState == WateringState.WD) && state == WateringState.D) {
        // 총급액이 50이 안되면 잘못된 급배액구간으로 간주하고 제거
        if (wateringDrainages.length > 0 && wd.supplyWeight < 50) {
          state = WateringState.D;
          wateringDrainages.pop();
          wd = wateringDrainages[wateringDrainages.length - 1];
          if (wd) wd.endTime = null;
        } else {
          lastEndIdx = i;
        }
      }
     }

    await Promise.all(wateringDrainages.map(async item => {
      item.drainageWeight = +item.drainageWeight.toFixed();
      item.supplyWeight = +item.supplyWeight.toFixed();
      item.hdLevel = await this.getHdLevel(inDeviceIdx, item.startTime);
    }));

    // TODO: 횟수가 너무 많은 경우 잘못된 값(계산이든 측정치든)이므로 예외처리가 필요하다


    return wateringDrainages;
  }

  /**
   * 1주일 최저, 최고 배지 수분
   * @param dripperNum 
   * @param deviceIdx 
   * @param dayKey 
   */
  async getMinMaxMoistureContent(deviceIdx: number, dayKey: number) {
    const startDayKey = DateUtils.toDayKey(DateUtils.add(DateUtils.dayKeyToDate(dayKey), -7, 'd'));
    let sql = `
      SELECT daykey, min(scm_moisture_content) min, max(scm_moisture_content) max FROM sdh_culture_medium 
      WHERE daykey between ${startDayKey} and ${dayKey} 
      AND device_idx = ${deviceIdx} 
      AND scm_moisture_content > 0 
      GROUP BY daykey
      ORDER BY dayKey desc
    `;
    const res = await this.sdhCmRepo.query(sql);
    return res;
  }

  /**
   * 배지무게편차
   * 1. 전날 마지막 급액 - 일출
   * (TODO) 2. 전날 마지막 급액 - 일몰
   * (TODO) 3. 일출 - 첫급액
   */
  async getWeightDiff(deviceIdx: number, dayKey?: number) {
    // 1. 전날 마지막 급액 - 일출
    let d = new Date();
    let dPrev = DateUtils.add(d, -1, 'd').toDate();
    if (dayKey) {
      d = DateUtils.dayKeyToDate(dayKey);
      dPrev = DateUtils.add(d, -1, 'd').toDate();
    }
    let dayKeyPrev = DateUtils.toDayKey(dPrev);

    // TODO: 마지막급여 구하는데에 로직상 오류가 있으므로, 우선 가장 높은값을 마지막급액으로 간주한다. 로직을 수정한 뒤 마지막급액을 구하도록 한다.
    const rsMax = await this.sdhCmRepo.createQueryBuilder()
      .select("MAX(SCM_WEIGHT)", "maxWeight")
      .where("DEVICE_IDX = :deviceIdx", { deviceIdx: deviceIdx })
      .andWhere("dayKey = :dayKey", { dayKey: dayKeyPrev })
      .getRawOne();
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [sunrise, sunset] = DateUtils.getSunriseSunset(d, this.config.lat, this.config.lng);
    const sunriseEnd = DateUtils.add(sunrise, 3, 'minutes').toDate();

    const rsSunrise = await this.sdhCmRepo.findOne({
      select: {weight: true},
      where: {deviceIdx: deviceIdx, sensingDt: Between(sunrise, sunriseEnd)},
      order: {sensingDt: "ASC"}
    });

    const maxWeight = rsMax ? rsMax.maxWeight : null;
    const sunriseWeight = rsSunrise ? rsSunrise.weight : null;
    const diff = isNaN(maxWeight - sunriseWeight) ? null : maxWeight - sunriseWeight;
    return diff / maxWeight;
  }

  async getHdLevel(deviceIdx, sensingDt: Date) {
    const internal = await this.sdhInternalRepo.findOne({
      select: {hdLevel: true},
      where: {deviceIdx: deviceIdx, sensingDt: LessThan(sensingDt)},
      order: {sensingDt: "DESC"}
    })

    return internal?.hdLevel;
  }

}