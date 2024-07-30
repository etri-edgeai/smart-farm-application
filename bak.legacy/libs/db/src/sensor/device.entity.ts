import { CommType } from '@libs/models';
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceModel } from './device-model.entity';

@Entity({ name: 'device', synchronize: false })
export class Device {
  @PrimaryGeneratedColumn({ name: 'DEVICE_IDX', comment: '장치 번호' })
  idx?: number;

  @Column({ name: 'DELETE_DT', comment: '삭제 날짜' })
  deleteDt?: Date;

  @Column({ name: 'DEVICE_SERIAL_NUMBER', comment: '등록 일련번호' })
  serialNumber?: string;

  @Column({ name: 'DEVICE_COMM_CD', type: 'enum', enum: CommType, comment: '통신유형' })
  commType?: CommType;

  @Column({ name: 'DEVICE_COMM_VALUE', comment: '통신기기번호' })
  commValue?: string;

  @Column({ name: 'USE_FLAG', comment: '사용 여부' })
  use?: boolean;

  @Column({ name: 'USE_REG_DT', comment: '사용 등록 날짜' })
  useRegDt?: Date;

  @Column({ name: 'USE_USER_IDX', comment: '사용 회원 번호' })
  useUserIdx?: number;

  @Column({ name: 'USE_FARM_DONG_IDX', comment: '사용 농장 동 번호' })
  useFarmDongIdx?: number;

  @Column({ name: 'MODEL_CD', comment: '센서 모델 번호' })
  modelIdx?: number = 1;

  @Column({ name: 'FORMAT_IDX', comment: '데이터포맷일련번호' })
  formatIdx?: number = 0;

  @Column({ name: 'DEVICE_REPORT_PERIOD', comment: '보고주기(분)' })
  reportPeriod?: number;

  @Column({ name: 'DEVICE_FIRST_REPORT_DT', comment: '처음 보고 날짜' })
  firstReportDt?: Date;

  @Column({ name: 'DEVICE_LAST_REPORT_DT', comment: '마지막 보고 날짜' })
  lastReportDt?: Date;

  @Column({ name: 'DEVICE_COMM_ERROR_FLAG', comment: '통신 오류 유무' })
  commError?: boolean = false;

  @Column({ name: 'CREATE_DT', comment: '생성 날짜' })
  createDt?: Date;

  @Column({ name: 'MODIFY_DT', comment: '수정 날짜' })
  updateDt?: Date;

  @ManyToOne(() => DeviceModel, deviceModel => deviceModel.devices)
  @JoinColumn({ name: 'MODEL_CD' })
  model: DeviceModel;

  @BeforeInsert()
  beforeInsert() {
    this.createDt = new Date();
    this.updateDt = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updateDt = new Date();
  }

}
