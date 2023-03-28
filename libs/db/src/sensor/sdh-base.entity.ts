import { PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn } from 'typeorm';

export abstract class SdhBase {
  @PrimaryGeneratedColumn({ name: 'IDX', comment: '일련번호' })
  idx?: number;

  @Column({ name: 'DEVICE_IDX', comment: '장치번호' })
  deviceIdx?: number;

  @Column({ name: 'DAYKEY', comment: '날짜' })
  dayKey?: number;
  @Column({ name: 'SENSING_DT', comment: '센싱날짜' })
  sensingDt?: Date;
  @CreateDateColumn({ name: 'CREATE_DT', comment: '생성날짜' })
  createDt: Date;

  isSunrise?: boolean; // dummy. 실제 칼럼은 각 sdh entitity에 있다

  @BeforeInsert()
  private beforeInsert() {
    this.fill();

    const year = this.sensingDt.getFullYear();
    const month = String(this.sensingDt.getMonth() + 1).padStart(2, '0');
    const day = String(this.sensingDt.getDate()).padStart(2, '0');
    const ymd = `${year}${month}${day}`;
    this.dayKey = +ymd;

    this.createDt = new Date();
  }

  abstract fill();
  abstract validate(); // TODO: insert 여부 등 다시 처리
}
