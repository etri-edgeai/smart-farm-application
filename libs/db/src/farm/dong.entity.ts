import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoolBitTransformer } from '../utils';
import { Farm } from './farm.entity';

@Entity({ name: 'farm_dong' })
export class Dong {
  @PrimaryGeneratedColumn({ name: 'FARM_DONG_IDX', comment: '일련번호' })
  idx?: number;

  @Column({ name: 'FARM_IDX', comment: '농장번호' })
  farmIdx?: number;

  @Column({ name: 'FARM_DONG_NO', comment: '동 번호' })
  no?: number;

  @Column({ name: 'MAIN_DONG_FLAG', type: 'bit', transformer: new BoolBitTransformer(), comment: '메인 동 여부' })
  main?: boolean;

  @Column({ name: 'ACTIVE', type: 'bit', transformer: new BoolBitTransformer(), comment: '활성여부' })
  active?: boolean;

  @Column({ name: 'IN_ENV_DEVICE_IDX', comment: '내부 환경 센서 디바이스 IDX' })
  inDeviceIdx?: number;

  @Column({ name: 'EXT_WEATHER_DEVICE_IDX', comment: '외부 기상 센서 디바이스 IDX' })
  exDeviceIdx?: number;

  @Column({ name: 'NUTRIENT_SOLUTION_DEVICE_IDX', comment: '양액 센서 디바이스 IDX' })
  nuDeviceIdx?: number;

  @Column({ name: 'CULTURE_MEDIUM_DEVICE_IDX', comment: '배지 센서 디바이스 IDX' })
  cmDeviceIdx?: number;

  @Column({ name: 'SOIL_DEVICE_IDX', comment: '토양 센서 디바이스 IDX' })
  soDeviceIdx?: number;

  @Column({ name: 'CREATE_DT', comment: '생성날짜' })
  createDt?: Date;

  @Column({ name: 'MODIFY_DT', comment: '수정날짜' })
  updateDt?: Date;

  @Column({ name: 'DELETE_DT', comment: '삭제날짜' })
  deleteDt?: Date;

  @ManyToOne(() => Farm, (farm) => farm.dongs)
  @JoinColumn({ name: "FARM_IDX" })
  farm: Farm;

  @BeforeInsert()
  beforeInsert() {
    this.createDt = new Date();
    this.updateDt = new Date();
  }

}
