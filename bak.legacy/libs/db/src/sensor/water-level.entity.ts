import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'water_level', synchronize: false })
export class WaterLevel {
  @PrimaryColumn({ name: 'ID' })
  id: string;

  @PrimaryColumn({ name: 'SENSING_DT' })
  sensingDt: Date;

  @Column({ name: 'DEPTH' })
  depth?: number;
  @Column({ name: 'LEVEL' })
  level?: number;
  @Column({ name: 'TEMP' })
  temp?: number;
  @Column({ name: 'EC' })
  ec?: number;
  @Column({ name: 'PH' })
  ph?: number;
  @Column({ name: 'VOLT' })
  volt?: number;

  @Column({ name: 'CREATE_DT', comment: '생성 날짜' })
  createDt?: Date;

  @BeforeInsert()
  beforeInsert() {
    this.createDt = new Date();
  }
}
