import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'sensor_org_data' })
export class SensorOrgData {
  @PrimaryGeneratedColumn({ name: 'SOD_IDX', type: 'bigint', comment: '일련번호' })
  idx: number;
  @Column({ name: 'DEVICE_IDX', type: 'bigint', comment: '장치번호' })
  deviceIdx: number;
  @Column({ name: 'ERROR_FLAG', type: 'bit', comment: '에러여부' })
  error: boolean;
  @Column({ name: 'JSON_CONTENT', type: 'text', comment: 'json' })
  jsonContent?: string;
  @Column({ name: 'ORG_CONTENT', type: 'text', comment: '원본' })
  orgContent: string;
  @CreateDateColumn({ name: 'CREATE_DT', comment: '생성날짜' })
  createDt: Date;

  constructor(idx: number, error: boolean, json: string, org: string) {
    this.deviceIdx = idx;
    this.error = error;
    this.jsonContent = json;
    this.orgContent = org;
    this.createDt = new Date();
  }
}
