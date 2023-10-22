import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserFarm } from '../user';
import { Dong } from './dong.entity';

@Entity({ name: 'farm', synchronize: false })
export class Farm {
  @PrimaryGeneratedColumn({ name: 'FARM_IDX', comment: '일련번호' })
  idx?: number;

  @Column({ name: 'FARM_NAME', comment: '농장명' })
  name?: string;

  @Column({ name: 'CREATE_DT', comment: '생성날짜' })
  createDt?: Date;

  @Column({ name: 'MODIFY_DT', comment: '수정날짜' })
  updateDt?: Date;

  @Column({ name: 'DELETE_DT', comment: '삭제날짜' })
  deleteDt?: Date;

  @Column({ name: 'FARM_SIDO_CD', comment: '시도코드' })
  sidoCode?: string;

  @Column({ name: 'FARM_SGG_CD', comment: '시군구코드' })
  sggCode?: string;

  @Column({ name: 'FARM_EMD_CD', comment: '읍면동코드' })
  emdCode?: string;

  @Column({ name: 'FARM_LATITUDE', type: 'double', comment: '위도' })
  latitude?: number;

  @Column({ name: 'FARM_LONGITUDE', type: 'double', comment: '경도' })
  longitude?: number;

  @Column({ name: 'FARM_DONG_TYPE', comment: '동타입' })
  dongType?: string;

  @Column({ name: 'FARM_DONG_COUNT', comment: '동수' })
  dongCount?: number;

  @Column({ name: 'UI_MAIN_DONG_IDX', comment: '메인동 번호' })
  uiMainDongIdx?: number;

  @Column({ name: 'FARM_SQM', comment: '넓이' })
  squareMeter?: number;
  
  @Column({ name: 'FARM_PYUNG', comment: '평수' })
  pyung?: number;

  @Column({ name: 'FARM_ADDRESS', comment: '주소' })
  address?: string;

  @Column({ name: 'EQUIPMENT_CODES', comment: '장비코드 목록' })
  equipmentCd?: string;

  @OneToMany(() => Dong, (farmDong) => farmDong.farm)
  dongs?: Dong[];

  @ManyToOne(() => UserFarm, (userFarm) => userFarm.farms)
  @JoinColumn({ name: "FARM_IDX" })
  userFarm?: UserFarm;

  @BeforeInsert()
  beforeInsert() {
    this.createDt = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updateDt = new Date();
  }
}
