import { PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, BeforeUpdate } from 'typeorm';

export abstract class SdBase {
  @PrimaryGeneratedColumn({ name: 'IDX', type: 'bigint', comment: '일련번호' })
  idx?: number;

  @Column({ name: 'DEVICE_IDX', type: 'bigint', width: 20, comment: '장치번호' })
  deviceIdx?: number;
  @Column({ name: 'LAST_IDX', type: 'bigint', width: 20, comment: '최종번호' })
  lastIdx?: number;
  @Column({ name: 'PRE_IDX', type: 'bigint', width: 20, comment: '이전번호' })
  preIdx?: number;

  @CreateDateColumn({ name: 'CREATE_DT', comment: '생성날짜' })
  createDt: Date;
  @CreateDateColumn({ name: 'UPDATE_DT', comment: '수정날짜' })
  updateDt: Date;

  @BeforeInsert()
  private beforeInsert() {
    const now = new Date();
    this.createDt = now;
    this.updateDt = now;
  }

  @BeforeUpdate()
  private beforeUpdate() {
    this.updateDt = new Date();
  }
}
