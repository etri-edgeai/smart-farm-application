import { CommonConfigService } from '@libs/config';
import { DongVentWatering, SITE_CONFIG, SdhCultureMedium, SdhExternal, SdhInternal, TENANT, WaterLevel } from '@libs/db';
import { DailySummary, DongDto, SiteConfig } from '@libs/models';
import { CalcUtils, DateUtils } from '@libs/utils';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CommService } from '@libs/comm';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SensingService {
  constructor(
    private config: CommonConfigService,
    private commService: CommService,
    @Inject(SITE_CONFIG) private siteConfig: SiteConfig,
    @InjectRepository(SdhInternal, TENANT) private sdhInRepo: Repository<SdhInternal>,
    @InjectRepository(SdhExternal, TENANT) private sdhExRepo: Repository<SdhExternal>,
    @InjectRepository(SdhCultureMedium, TENANT) private sdhCmRepo: Repository<SdhCultureMedium>,
    @InjectRepository(DongVentWatering, TENANT) private vwRepo: Repository<DongVentWatering>,
    @InjectRepository(WaterLevel, TENANT) private waterLevelRepo: Repository<WaterLevel>,
  ) {}

  getLastInternal(deviceIdx) {
    return this.sdhInRepo.findOne({
      where: { deviceIdx: deviceIdx },
      order: {sensingDt: "DESC"}
    });
  }

  getWaterLevel(data: any) {
    const res = this.waterLevelRepo.find({
      take: 48, // 시간
      order: {sensingDt: "desc"}
    });
    return res;
  }

  /**
   * 여러 동 환경조회
   * @param data
   * @returns
   */
  async getEnvs(data: any) {
    const startDk = data.start;
    const endDk = data.end;
    const dongs = data.dongs;

    const envPromises = [];

    for (let dong of dongs) {
      const promise = this.getEnv(dong, startDk, endDk);
      envPromises.push(promise);
    }

    const res = await Promise.all(envPromises);
    return res;
  }

  /**
   * 동별 환경조회
   * @param dong
   * @param startDk
   * @param endDk
   * @returns
   */
  async getEnv(dong: Partial<DongDto>, startDk, endDk) {
    const inPromise = this.sdhInRepo.find({
      select: ['sensingDt', 'temp', 'wetBulbTemp', 'humidity', 'co2', 'solarRadiation', 'lightness', 'hd', 'hdLevel', 'absoluteWaterContent', 'dewPointTemp', 'enthalpy', 'isSunrise'],
      where: {dayKey: Between(startDk, endDk), deviceIdx: dong.inDeviceIdx}, order: {sensingDt: 'ASC'}
    });
    const exPromise = this.sdhExRepo.find({
      select: ['sensingDt', 'temp', 'humidity', 'windDirection', 'windSpeed', 'rainFall', 'solarRadiation', 'lightness'],
      where: {dayKey: Between(startDk, endDk), deviceIdx: dong.exDeviceIdx}, order: {sensingDt: 'ASC'}
    });
    const cmPromise = this.sdhCmRepo.find({
      select: ['sensingDt', 'temp', 'moistureContent', 'weight', 'supplyWeight', 'drainageWeight', 'ec', 'poreEc', 'intakeEc'],
      where: {dayKey: Between(startDk, endDk), deviceIdx: dong.cmDeviceIdx}, order: {sensingDt: 'ASC'}
    });

    // 조회일이 오늘이 아닐 경우 endDk 다음날까지 가져와서 summary 데이터를 구한다(야간값을 구하기 위해)
    const endNextDk = DateUtils.toDayKey(DateUtils.add(DateUtils.dayKeyToDate(endDk), 1, 'd'));
    const todayDk = DateUtils.toDayKey(new Date());
    let inNextPromise = Promise.resolve([]);
    if (endDk < todayDk) {
      inNextPromise = this.sdhInRepo.find({
        select: ['sensingDt', 'temp', 'wetBulbTemp', 'humidity', 'co2', 'solarRadiation', 'lightness', 'hd', 'hdLevel', 'absoluteWaterContent', 'dewPointTemp', 'enthalpy', 'isSunrise'],
        where: {dayKey: Between(endNextDk, endNextDk), deviceIdx: dong.inDeviceIdx}, order: {sensingDt: 'ASC'}
      });
    }

    const [rsIn, rsEx, rsCm, rsVw, rsInNext] = await Promise.all([inPromise, exPromise, cmPromise, this.getVentWatering(dong.idx, startDk, endDk), inNextPromise]);

    const rsInAll =  rsIn.concat(rsInNext);

    const dailySummary = this.getDailySummary(rsInAll, startDk);
    dailySummary.forEach(d => {
      const vw = rsVw.find(r => r.dayKey == DateUtils.toDayKey(d.date));
      if (vw) {
        d.ventRecommendDt = vw.ventRecommendDt;
        d.wateringRecommendDt = vw.wateringRecommendDt;
      }
    })

    // 일출 일몰
    const sunrises= [];
    const d = DateUtils.dayKeyToDate(startDk);
    for (;;) {
      const dayKey = DateUtils.toDayKey(d);
      const [sunrise, sunset] = DateUtils.getSunriseSunset(d, this.config.lat, this.config.lng);

      sunrises.push({sunrise, sunset});
        if (dayKey >= endDk) {
            break;
        }
        d.setDate(d.getDate() + 1);
    }

    return {sensorData: {in: rsIn, ex: rsEx, cm: rsCm}, dailySummary: dailySummary, sunrises};
  }

  /**
  * 일별 통계 데이터
  */
  getDailySummary(rsIn: SdhInternal[], startDk) {
    let prevDate = DateUtils.dayKeyToDate(startDk);
    let prevDayKey = DateUtils.toDayKey(prevDate);

    let dss: DailySummary[] = [];
    let ds = new DailySummary();
    let prevDs = null;
    ds.date = DateUtils.format(prevDate, 'YYYY-MM-DD');

    ds.hdFitDuration = 0;
    let idx = 0;
    let tempTotal = 0;
    let tempDayTotal = 0;
    let tempNightTotal = 0;
    let tempCount = 0;
    let tempDayCount = 0;
    let tempNightCount = 0;
    let humTotal = 0;
    let humDayTotal = 0;
    let humNightTotal = 0;
    let humCount = 0;
    let humDayCount = 0;
    let humNightCount = 0;
    let hdDayCount = 0;
    let hdDayTotal = 0;

    let hdFitStartDt;

    for (const r of rsIn) {
      const currDate = r.sensingDt;
      const currDayKey = DateUtils.toDayKey(currDate);
      let d = 0; // 지난 row와의 시간 차

      // 날짜가 바뀌면 전일까지의 데이터를 정리하고 새 날짜의 object를 생성
      if (currDayKey > prevDayKey) {
        // 완료된 전일까지의 데이터 정리
        ds.tempAvgDay = tempTotal / tempCount;
        ds.humAvgDay = humTotal / humCount;
        ds.tempAvgDayTime = tempDayTotal / tempDayCount;
        ds.humAvgDayTime = humDayTotal / humDayCount;
        ds.hdAvgDayTime = hdDayTotal / hdDayCount;

        dss.push(ds);
        prevDs = ds;

        ds = new DailySummary();
        ds.date = DateUtils.format(currDate, 'YYYY-MM-DD');
        ds.hdFitDuration = 0;

        d = DateUtils.diffS(currDate, DateUtils.dayKeyToDate(currDayKey)); // 0시부터 계산
        tempCount = 0;
        tempTotal = 0;
        tempDayCount = 0;
        //tempNightCount = 0;
        tempDayTotal = 0;
        //tempNightTotal = 0;

        humCount = 0;
        humDayCount = 0;
        //humNightCount = 0;
        humTotal = 0;
        humDayTotal = 0;
        //humNightTotal = 0;
        hdDayCount = 0;
        hdDayTotal = 0;
      } else if (idx + 1 < rsIn.length && currDayKey < DateUtils.toDayKey(rsIn[idx + 1].sensingDt)) {
        // 오늘의 마지막 row인 경우 d를 현재 시각이 아니라 24시까지로 계산한다
        const nextDayKey = DateUtils.toDayKey(rsIn[idx + 1].sensingDt);
        const nextDate = DateUtils.dayKeyToDate(nextDayKey);
        d = DateUtils.diffS(nextDate, prevDate);

        // 증산적합유지시각 update
        if (hdFitStartDt) {
          ds.hdFitDuration += DateUtils.toMoment(r.sensingDt).diff(DateUtils.toMoment(hdFitStartDt), 'minutes');
          hdFitStartDt = null;
        }
      } else {
        d = DateUtils.diffS(currDate, prevDate);
      }

      const t = r.temp;
      const h = r.humidity;
      const hd = r.hd;

      if (hd != null) {
        hdDayCount++;
        hdDayTotal += hd;
      }

      if (t != null) {
        tempCount += d;
        tempTotal += t * d;

        ds.tempMinDay = Math.min(ds.tempMinDay, t);
        ds.tempMaxDay = Math.max(ds.tempMaxDay, t);

        if (t < 20) ds.tempUnder20 += d;
        else if (t < 22) ds.tempOver20 += d;
        else if (t < 24) ds.tempOver22 += d;
        else if (t < 26) ds.tempOver24 += d;
        else if (t < 28) ds.tempOver26 += d;
        else if (t < 30) ds.tempUnder20 += d;
        else if (t >= 30) ds.tempOver30 += d;

        if (r.isSunrise) {
          ds.tempMinDayTime = Math.min(ds.tempMinDayTime, t);
          ds.tempMaxDayTime = Math.max(ds.tempMaxDayTime, t);
          tempDayCount += d;
          tempDayTotal += t * d;

          if (tempNightCount > 0) {
            // 전날 야간으로 처리
            if (prevDs) {
              prevDs.tempAvgNightTime = tempNightTotal / tempNightCount;
            }
            tempNightTotal = 0;
            tempNightCount = 0;
          }

          if (t < 20) ds.tempUnder20Day += d;
          else if (t < 22) ds.tempOver20Day += d;
          else if (t < 24) ds.tempOver22Day += d;
          else if (t < 26) ds.tempOver24Day += d;
          else if (t < 28) ds.tempOver26Day += d;
          else if (t < 30) ds.tempUnder20Day += d;
          else if (t >= 30) ds.tempOver30Day += d;
        } else {
          // 새벽이면 전날 야간으로 처리
          let tds;
          if (r.amPmType == 'A') {
            tds = prevDs;
          } else {
            tds = ds;
          }

          if (tds) {
            tds.tempMinNightTime = Math.min(tds.tempMinNightTime, t);
            tds.tempMaxNightTime = Math.max(tds.tempMaxNightTime, t);
            tempNightCount += d;
            tempNightTotal += t * d;

            if (t < 20) tds.tempUnder20Night += d;
            else if (t < 22) tds.tempOver20Night += d;
            else if (t < 24) tds.tempOver22Night += d;
            else if (t < 26) tds.tempOver24Night += d;
            else if (t < 28) tds.tempOver26Night += d;
            else if (t < 30) tds.tempUnder20Night += d;
            else if (t >= 30) tds.tempOver30Night += d;
          }
        }
      }

      if (h != null && h > 0) {
        humCount += d;
        humTotal += h * d;

        if (h < 75) ds.humUnder75 += d;
        else if (h < 80) ds.humOver75 += d;
        else if (h < 85) ds.humOver80 += d;
        else if (h < 90) ds.humOver85 += d;
        else if (h < 95) ds.humOver90 += d;
        else if (h >= 95) ds.humOver90 += d;

        if (r.isSunrise) {
          humDayCount += d;
          humDayTotal += h * d;
          if (humNightCount > 0) {
            // 전날 야간으로 처리
            if (prevDs) {
              prevDs.humAvgNightTime = humNightTotal / humNightCount;
            }
            humNightTotal = 0;
            humNightCount = 0;
          }

          if (h < 75) ds.humUnder75Day += d;
          else if (h < 80) ds.humOver75Day += d;
          else if (h < 85) ds.humOver80Day += d;
          else if (h < 90) ds.humOver85Day += d;
          else if (h < 95) ds.humOver90Day += d;
          else if (h >= 95) ds.humOver90Day += d;
        } else {
          // 새벽이면 전날 야간으로 처리
          let tds;
          if (r.amPmType == 'A') {
            tds = prevDs;
          } else {
            tds = ds;
          }

          if (tds) {
            humNightCount += d;
            humNightTotal += h * d;

            if (h < 75) tds.humUnder75Night += d;
            else if (h < 80) tds.humOver75Night += d;
            else if (h < 85) tds.humOver80Night += d;
            else if (h < 90) tds.humOver85Night += d;
            else if (h < 95) tds.humOver90Night += d;
            else if (h >= 95) tds.humOver90Night += d;
          }
        }
      }

      prevDate = currDate;
      prevDayKey = currDayKey;
      idx++;
    }

    let forDayPercent = 1440 / 100;
    let forDayTimePercent;
    let forNightTimePercent;

    // 데이터 정리
    for (const ds of dss) {
      ds.tempAvgDay = +ds.tempAvgDay.toFixed(1);
      ds.tempAvgDayTime = +ds.tempAvgDayTime.toFixed(1);
      ds.tempAvgNightTime = +ds.tempAvgNightTime.toFixed(1);
      ds.tempDiffDayNight = +(ds.tempAvgDayTime - ds.tempAvgNightTime).toFixed(12);

      ds.humAvgDay = +ds.humAvgDay.toFixed(1);
      ds.humAvgDayTime = +ds.humAvgDayTime.toFixed(1);
      ds.humAvgNightTime = +ds.humAvgNightTime.toFixed(1);
      ds.hdAvgDayTime = +ds.hdAvgDayTime.toFixed(1);

      // 지속 시간(분) 으로 계산하다가 비중(%) 으로 바꾸면서 수식을 그대로 두다보니 복잡해졌다
      // 나중에 다시 분으로 쓸 일이 있을까봐 놔둔다
      ds.tempUnder20 = +(ds.tempUnder20 / 60 / forDayPercent).toFixed(1);
      ds.tempOver20 = +(ds.tempOver20 / 60 / forDayPercent).toFixed(1);
      ds.tempOver22 = +(ds.tempOver22 / 60 / forDayPercent).toFixed(1);
      ds.tempOver24 = +(ds.tempOver24 / 60 / forDayPercent).toFixed(1);
      ds.tempOver26 = +(ds.tempOver26 / 60 / forDayPercent).toFixed(1);
      ds.tempOver28 = +(ds.tempOver28 / 60 / forDayPercent).toFixed(1);
      ds.tempOver30 = +(ds.tempOver30 / 60 / forDayPercent).toFixed(1);

      forDayTimePercent =
        (ds.tempUnder20Day +
          ds.tempOver20Day +
          ds.tempOver22Day +
          ds.tempOver24Day +
          ds.tempOver26Day +
          ds.tempOver28Day +
          ds.tempOver30Day) /
        60 /
        100;
      ds.tempUnder20Day = +(ds.tempUnder20Day / 60 / forDayTimePercent).toFixed(1);
      ds.tempOver20Day = +(ds.tempOver20Day / 60 / forDayTimePercent).toFixed(1);
      ds.tempOver22Day = +(ds.tempOver22Day / 60 / forDayTimePercent).toFixed(1);
      ds.tempOver24Day = +(ds.tempOver24Day / 60 / forDayTimePercent).toFixed(1);
      ds.tempOver26Day = +(ds.tempOver26Day / 60 / forDayTimePercent).toFixed(1);
      ds.tempOver28Day = +(ds.tempOver28Day / 60 / forDayTimePercent).toFixed(1);
      ds.tempOver30Day = +(ds.tempOver30Day / 60 / forDayTimePercent).toFixed(1);

      forNightTimePercent =
        (ds.tempUnder20Night +
          ds.tempOver20Night +
          ds.tempOver22Night +
          ds.tempOver24Night +
          ds.tempOver26Night +
          ds.tempOver28Night +
          ds.tempOver30Night) /
        60 /
        100;
      ds.tempUnder20Night = +(ds.tempUnder20Night / 60 / forNightTimePercent).toFixed(1);
      ds.tempOver20Night = +(ds.tempOver20Night / 60 / forNightTimePercent).toFixed(1);
      ds.tempOver22Night = +(ds.tempOver22Night / 60 / forNightTimePercent).toFixed(1);
      ds.tempOver24Night = +(ds.tempOver24Night / 60 / forNightTimePercent).toFixed(1);
      ds.tempOver26Night = +(ds.tempOver26Night / 60 / forNightTimePercent).toFixed(1);
      ds.tempOver28Night = +(ds.tempOver28Night / 60 / forNightTimePercent).toFixed(1);
      ds.tempOver30Night = +(ds.tempOver30Night / 60 / forNightTimePercent).toFixed(1);

      ds.humUnder75 = +(ds.humUnder75 / 60 / forDayPercent).toFixed(1);
      ds.humOver75 = +(ds.humOver75 / 60 / forDayPercent).toFixed(1);
      ds.humOver80 = +(ds.humOver80 / 60 / forDayPercent).toFixed(1);
      ds.humOver85 = +(ds.humOver85 / 60 / forDayPercent).toFixed(1);
      ds.humOver90 = +(ds.humOver90 / 60 / forDayPercent).toFixed(1);
      ds.humOver95 = +(ds.humOver95 / 60 / forDayPercent).toFixed(1);

      forDayTimePercent =
        (ds.humUnder75Day + ds.humOver75Day + ds.humOver80Day + ds.humOver85Day + ds.humOver90Day + ds.humOver95Day) / 60 / 100;
      ds.humUnder75Day = +(ds.humUnder75Day / 60 / forDayTimePercent).toFixed(1);
      ds.humOver75Day = +(ds.humOver75Day / 60 / forDayTimePercent).toFixed(1);
      ds.humOver80Day = +(ds.humOver80Day / 60 / forDayTimePercent).toFixed(1);
      ds.humOver85Day = +(ds.humOver85Day / 60 / forDayTimePercent).toFixed(1);
      ds.humOver90Day = +(ds.humOver90Day / 60 / forDayTimePercent).toFixed(1);
      ds.humOver95Day = +(ds.humOver95Day / 60 / forDayTimePercent).toFixed(1);

      forNightTimePercent =
        (ds.humUnder75Night + ds.humOver75Night + ds.humOver80Night + ds.humOver85Night + ds.humOver90Night + ds.humOver95Night) /
        60 /
        100;
      ds.humUnder75Night = +(ds.humUnder75Night / 60 / forNightTimePercent).toFixed(1);
      ds.humOver75Night = +(ds.humOver75Night / 60 / forNightTimePercent).toFixed(1);
      ds.humOver80Night = +(ds.humOver80Night / 60 / forNightTimePercent).toFixed(1);
      ds.humOver85Night = +(ds.humOver85Night / 60 / forNightTimePercent).toFixed(1);
      ds.humOver90Night = +(ds.humOver90Night / 60 / forNightTimePercent).toFixed(1);
      ds.humOver95Night = +(ds.humOver95Night / 60 / forNightTimePercent).toFixed(1);
    }

    return dss;
  }

  getVentWatering(dongIdx, startDk, endDk) {
    return this.vwRepo.find({
      where: {
      dongIdx: dongIdx,
      dayKey: Between(startDk, endDk)
      },
      order: { dayKey: "ASC" }
    });
  };

  /*
  getVegetativeReproductive(farmIdx) {
    this.statService.getInDayStatistics(19, 20230418, 20230420);
    return {};
  }
  */

    /**
   * 이전 6일간 일출, 일몰 전후의 온도
   * @param deviceIdx
   * @param date ex) 2023-01-01
   * @returns
   */
  async getTempBySun(deviceIdx, date: string) {
    // 현재 시각 기준 예측치
    const predict = await lastValueFrom(this.commService.send('ai.predictInEnv', {headers: {siteCode: this.siteConfig.code}, body: {deviceIdx: deviceIdx, time: new Date()}}))
      .catch(e => {Logger.error('Failed ai. ', e)});

    const promises = [];
    for (let i = 0; i < 8; i++) {
      const targetDate = DateUtils.toDateString(DateUtils.add(date, 1 - i, 'd'));
      promises.push(this.getTempBySunOneDay(deviceIdx, targetDate, predict));
    }

    const res = await Promise.all(promises);
    let predictStartRow = 0;
    const ret = res.map(r => {predictStartRow = Math.max(predictStartRow, r.predictStartRow); return r.data;});
    return {predictStartRow, data: ret};
  }

  /**
   * 특정일의 일출, 일몰 전후의 온도
   * @param deviceIdx
   * @param date ex) 2023-01-01
   * @returns
   */
  async getTempBySunOneDay(deviceIdx, date: string, predict?: []) {
    const promises = [];
    const sunriseList = [-1, 0, 1, 2, 3, 4, 5]; // 일출 전후 -1, 0, 1, .. 시각
    const sunsetList = [-2, -1, 0, 1, 2, 3, 4]; // 일몰 전후 -2, -1, 0, 1, ... 시각
    const [sunrise, sunset] = DateUtils.getSunriseSunset(date, this.siteConfig.latitude, this.siteConfig.longitude);

    let predictStartRow = 0;
    let rowidx = 0; // predictStartRow를 구하기 위한 row의 index
    for (const gap of sunriseList) {
      const targetDt = DateUtils.add(sunrise, gap, 'hour').toDate();
      targetDt.setSeconds(0);
      targetDt.setMilliseconds(0);

      if (targetDt < new Date()) {
        const limitDt = DateUtils.add(targetDt, 5, 'minute').toDate();
        promises.push(this.getTempsAtSpecificTime(deviceIdx, targetDt, limitDt));
      } else if (predict) {
        // by predict
        const matched = predict.find(p => Math.abs(DateUtils.diffM(p[0], targetDt)) <= 10);
        if (matched) {
          promises.push(Promise.resolve([{temp: matched[1]}]));
          if (predictStartRow == 0) predictStartRow = rowidx;
        } else {
          promises.push(Promise.resolve([{temp: null}]));
        }
      } else {
        promises.push(Promise.resolve([{temp: null}]));
      }
      rowidx++;
    }

    for (const gap of sunsetList) {
      const targetDt = DateUtils.add(sunset, gap, 'hour').toDate();
      targetDt.setSeconds(0);
      targetDt.setMilliseconds(0);

      if (targetDt < new Date()) {
        const limitDt = DateUtils.add(targetDt, 5, 'minute').toDate();
        promises.push(this.getTempsAtSpecificTime(deviceIdx, targetDt, limitDt));
      } else if (predict) {
        // by predict
        const matched = predict.find(p => Math.abs(DateUtils.diffM(p[0], targetDt)) <= 10);
        if (matched) {
          promises.push(Promise.resolve([{temp: matched[1]}]));
          if (predictStartRow == 0) predictStartRow = rowidx;
        } else {
          promises.push(Promise.resolve([{temp: null}]));
        }
      } else {
        promises.push(Promise.resolve([{temp: null}]));
      }

      rowidx++;
    }

    const res = await Promise.all(promises);
    const ret = res.map(r => (r && r.length > 0 && r[0].temp != null) ? +r[0].temp.toFixed(1) : null);
    return {predictStartRow, data: ret};
  }

  /**
   * 특정 시각의 내부 온도 5개 가져오기
   * @param deviceIdx
   * @param date
   */
  getTempsAtSpecificTime(deviceIdx: number, date: Date, limitDate: Date) {
    return this.sdhInRepo.find({
      where: { deviceIdx: deviceIdx, sensingDt: Between(date, limitDate)},
      order: {sensingDt: "ASC"},
      take: 1
    });
  }

}
