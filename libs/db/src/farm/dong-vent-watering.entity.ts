import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';
import { DateUtils } from '@libs/utils/date.utils';

@Entity({ name: 'farm_dong_vent_watering2' })
export class DongVentWatering {
  @PrimaryColumn({ name: 'FARM_DONG_IDX', comment: '동번호' })
  dongIdx?: number;
  @PrimaryColumn({ name: 'FDV_DAY_KEY', comment: '날짜' })
  dayKey?: number;

  @Column({ name: 'VENT_RCMND_DT', comment: '환기 권장시간' })
  ventRecommendDt?: Date;
  @Column({ name: 'VENT_EXCTN_DT', comment: '환기 실시시간' })
  ventExecutionDt?: Date;
  @Column({ name: 'WATERING_RCMND_DT', comment: '관수 권장시간' })
  wateringRecommendDt?: Date;
  @Column({ name: 'WATERING_EXCTN_DT', comment: '관수 실시시간' })
  wateringExecutionDt?: Date;

  @BeforeInsert()
  private beforeInsert() {
    if (!this.dayKey) {
      this.dayKey = DateUtils.toDayKey(new Date());
    }
  }
}
