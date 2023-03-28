import { CalcUtils } from '@libs/utils';
import { Entity, Column, Repository } from 'typeorm';
import { SdhBase } from './sdh-base.entity';

@Entity({ name: 'sdh_external' })
export class SdhExternal extends SdhBase {
  @Column({ name: 'SEWS_TEMP', type: 'double', comment: '온도(건구)' })
  temp?: number;
  @Column({ name: 'SEWS_HUMIDITY', type: 'double', comment: '습도' })
  humidity?: number;
  @Column({ name: 'SEWS_WIND_DIRECTION', comment: '풍향' })
  windDirection?: string;
  @Column({ name: 'SEWS_WIND_SPEED', type: 'double', comment: '풍속' })
  windSpeed?: number;
  @Column({ name: 'SEWS_SOLAR_RADIATION', type: 'double', comment: '일사' })
  solarRadiation?: number;
  @Column({ name: 'SEWS_LIGHTNESS', type: 'double', comment: '광량'})
  lightness?: number;

  @Column({ name: 'SEWS_RAINFALL', type: 'double', comment: '강우량' })
  rainFall?: number;
  @Column({ name: 'SEWS_RAIN_FLAG', comment: '감우' })
  rain?: boolean;

  @Column({ name: 'SEWS_SUNRISE_SUNSET_FLAG', comment: '일출 여부' })
  override isSunrise?: boolean;

  static lastDataMap: {[k: number]: SdhExternal} = {}; // deviceIdx - SdhExternal pairs

  fill() {
    if (this.solarRadiation < 0) this.solarRadiation = null;
  }

  validate() {
    if (this.temp == null) return false;
    if (this.temp > 80 || this.temp < -50) return false;
    if (this.humidity != null && (this.humidity > 100 || this.humidity < 0)) return false;
    if (!this.temp && !this.humidity) return false; // 둘 다 없거나 0이면 잘못된 것으로 간주

    return true;
  }
  
  async fillAccSolarRadiation(dbName: string, repo: Repository<SdhExternal>) {
    if (this.lightness != null) return; // 센서에서 들어오는 값이면 여기서 계산할 필요없음

    let lastData: SdhExternal = SdhExternal.lastDataMap[dbName + this.deviceIdx];
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
    const lastInternal = SdhExternal.lastDataMap[dbName + this.deviceIdx];
    if (!lastInternal || lastInternal.sensingDt < this.sensingDt) {
      SdhExternal.lastDataMap[dbName + this.deviceIdx] = this;
    }
  }
}
