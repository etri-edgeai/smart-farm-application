import { CalcUtils } from '@libs/utils/calc.utils';
import { Entity, Column, Repository } from 'typeorm';
import { SdhBase } from './sdh-base.entity';
import { AMPM_TYPE } from '@libs/utils/date.utils';
import { Logger } from '@nestjs/common';

@Entity({ name: 'sdh_internal' })
export class SdhInternal extends SdhBase {

  @Column({ name: 'SIE_TEMP', type: 'double', comment: '건구 온도' })
  temp?: number;
  @Column({ name: 'SIE_HUMIDITY', type: 'double', comment: '상대 습도' })
  humidity?: number;
  @Column({ name: 'SIE_WET_BULB_TEMP', type: 'double', comment: '습구 온도' })
  wetBulbTemp?: number;
  @Column({ name: 'SIE_CO2', type: 'double', comment: 'co2' })
  co2?: number;
  @Column({ name: 'SIE_LIGHTNESS', type: 'double', comment: '광량' })
  lightness?: number;

  @Column({ name: 'SIE_SOLAR_RADIANTION', type: 'double', comment: '일사' })
  solarRadiation?: number;
  @Column({ name: 'SIE_ILLUMINANCE', type: 'double', comment: '조도' })
  illuminance?: number;
  @Column({ name: 'SIE_DEW_POINT_TEMP', type: 'double', comment: '이슬점 온도' })
  dewPointTemp?: number;
  @Column({ name: 'SIE_HD', type: 'double', comment: '수분부족분(HD)' })
  hd?: number;
  @Column({ name: 'SIE_HD_LEVEL', comment: '수분부족분(HD)' })
  hdLevel?: number;
  @Column({ name: 'SIE_CM_TEMP', comment: '근권(배지)온도' })
  cultureMediumTemp?: number;
  @Column({ name: 'SIE_CM_HUMIDITY', comment: '근권(배지)습도' })
  cultureMediumHumidity?: number;
  @Column({ name: 'SIE_ABS_WATER', comment: '절대수분량' })
  absoluteWaterContent?: number;

  @Column({ name: 'SIE_AM_PM_TYPE', type: 'varchar', comment: '오전오후 구분' })
  amPmType?: AMPM_TYPE;
  @Column({ name: 'SIE_SUNRISE_SUNSET_FLAG', comment: '일출 여부' })
  override isSunrise?: boolean;

  @Column({ name: 'SIE_ENTHALPY', comment: '습기 엔탈피' })
  enthalpy?: number;

  @Column({ name: 'TIME_DIFF' })
  timeDiff?: number;

  static lastDataMap: {[k: string]: SdhInternal} = {}; // deviceIdx - SdhInternal pairs

  fill() {
    if (isNaN(this.humidity)) this.humidity = null;

    if (isNaN(this.dewPointTemp)) this.dewPointTemp = null;

    if (isNaN(this.hd)) this.hd = null;

    this.amPmType = this.sensingDt.getHours() >= 12 ? AMPM_TYPE.PM : AMPM_TYPE.AM;
  }

  async fillAccSolarRadiation(dbName: string, repo: Repository<SdhInternal>) {
    if (this.lightness != null) return; // 센서에서 들어오는 값이면 여기서 계산할 필요없음

    let lastData: SdhInternal = SdhInternal.lastDataMap[dbName + this.deviceIdx];
    if (!lastData) {
      lastData = await repo.findOne({where:{deviceIdx: this.deviceIdx}, order: {sensingDt:"DESC"}});
      if (!lastData) return;
    }

    if (lastData.sensingDt >= this.sensingDt) return; // 과거 데이터이면 계산하지 않음
    let lightness = lastData.lightness;
    if (!lastData.isSunrise && this.isSunrise) { // 일출 경과하면 리셋. sunrise는 save시 fill이 불리기 전에 세팅됨
      lightness = lightness >= 0 ? 0 : null;
    }

    // 일사값이 들어오거나 이전에 누적일사량이 있으면 계산
    if (this.solarRadiation >= 0 || lightness >= 0) {
      const d = (this.sensingDt.getTime() - lastData.sensingDt.getTime()) / 1000; // seconds
      this.lightness = lightness + CalcUtils.nanToNull((this.solarRadiation * d) / 10000); // W/m^2 * secs => J/cm^2
    }

    this.lightness = CalcUtils.nanToNull(this.lightness);
    if (this.lightness) {
      this.lightness = +this.lightness.toFixed(2);
    }
  }

  setLastDataMap(dbName) {
    const lastInternal = SdhInternal.lastDataMap[dbName + this.deviceIdx];
    if (!lastInternal || lastInternal.sensingDt < this.sensingDt) {
      SdhInternal.lastDataMap[dbName + this.deviceIdx] = this;
    }
  }

  validate() {
    if (this.temp == null) return false;
    if (this.temp > 80 || this.temp < -50) return false;
    if (this.wetBulbTemp > 80 || this.wetBulbTemp < -50) {
      // return false;
      Logger.warn(`DeviceIdx ${this.deviceIdx}: WetBulpTemp wrong value - ${this.wetBulbTemp} `);
      this.wetBulbTemp = null; //
    }

    if (this.humidity != null && (this.humidity > 100 || this.humidity < 0)) return false;
    if (!this.temp && !this.humidity) return false; // 둘 다 없거나 0이면 잘못된 것으로 간주

    return true;
  }
}
