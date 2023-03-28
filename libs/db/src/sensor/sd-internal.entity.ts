import { Entity, Column } from 'typeorm';
import { SdBase } from './sd-base.entity';

@Entity({ name: 'sd_internal' })
export class SdInternal extends SdBase {
  @Column({ name: 'LAST_SENSING_DT', comment: '최종센싱날짜' })
  lastSensingDt?: Date;

  @Column({ name: 'SUNRISE_HD_MSG', width: 1024, comment: 'HD 정보' })
  sunriseHdMsg?: string;

  @Column({ name: 'VENTILATION', width: 2048, comment: '환기정보' })
  ventilation?: string;

  @Column({ name: 'SUNRISE_FLAG', comment: '일출여부' })
  isSunrise?: boolean;
}
