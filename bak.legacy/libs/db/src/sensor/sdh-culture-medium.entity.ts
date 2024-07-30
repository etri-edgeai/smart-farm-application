import { AMPM_TYPE } from '@libs/utils/date.utils';
import { Entity, Column } from 'typeorm';
import { SdhBase } from './sdh-base.entity';

@Entity({ name: 'sdh_culture_medium' })
export class SdhCultureMedium extends SdhBase {
  @Column({ name: 'AM_PM_TYPE', comment: '오전오후 구분' })
  amPmType?: string;
  @Column({ name: 'SUNRISE_SUNSET_FLAG', comment: '일출여부' })
  override isSunrise?: boolean;

  @Column({ name: 'SCM_TEMP', type: 'double', comment: '온도'})
  temp?: number;          
  @Column({ name: 'SCM_MOISTURE_CONTENT', type: 'double', comment: '함수율' })
  moistureContent?: number;            
  @Column({ name: 'SCM_EC', type: 'double',  comment: 'EC value'})
  ec?: number;
  @Column({ name: 'SCM_PH', type: 'double',  comment: 'PH value'})
  ph?: number;
  @Column({ name: 'SCM_WEIGHT', type: 'double',  comment: 'PH value'})
  weight?: number;
  @Column({ name: 'SCM_SUPPLY_WEIGHT', type: 'double',  comment: 'PH value'})
  supplyWeight?: number;
  @Column({ name: 'SCM_DRAINAGE_WEIGHT', type: 'double',  comment: 'PH value'})
  drainageWeight?: number;
  @Column({ name: 'PORE_EC', type: 'double',  comment: 'PORE EC value'})
  poreEc?: number;
  @Column({ name: 'INTAKE_EC', type: 'double',  comment: 'INTAKE EC value'})
  intakeEc?: number;

  fill() {
    this.amPmType = this.sensingDt.getHours() >= 12 ? AMPM_TYPE.PM : AMPM_TYPE.AM;
  }

  validate() {
    if (!this.temp && !this.moistureContent && !this.ec && !this.weight && !this.supplyWeight && !this.drainageWeight ) return false;
    if (this.temp > 80 || this.temp < -50) return false;
    if (this.moistureContent != null && (this.moistureContent > 100 || this.moistureContent < 0)) return false;

    return true;
  }
}
