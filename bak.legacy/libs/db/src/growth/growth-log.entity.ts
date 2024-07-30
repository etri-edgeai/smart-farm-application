import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'growth_log' })
export class GrowthLog {
  @PrimaryGeneratedColumn({ name: 'glog_idx'})
  idx?: number;

  @Column({ name: 'fcs_idx' })
  fcsIdx: number;
  @Column({ name: 'invt_dt' })
  invDt: Date;
  @Column({ name: 'smpl_no' })
  sampleId: string;
  @Column({ name: 'farm_idx' })
  farmIdx: number;
  @Column({ name: 'week_idx' })
  week?: number;
  @Column({ name: 'crop_cd' })
  cropCd?: number;

  @Column({ name: 'smpl_stus' })
  status?: number;
  @Column({ name: 'init_lnth' })
  plantHeight?: number;
  @Column({ name: 'week_grth' })
  weekGrowth?: number;
  @Column({ name: 'stem_thck' })
  stemThick?: number;
  @Column({ name: 'leaf_lnth' })
  leafLength?: number;
  @Column({ name: 'leaf_wdth' })
  leafWidth?: number;
  @Column({ name: 'leaf_cnts' })
  leafCount?: number;
  @Column({ name: 'blmg_loca' })
  flowerLocation?: number;
  @Column({ name: 'stem_flwr' })
  stemFlowerDistance?: number;
  @Column({ name: 'bwtn_blmg' })
  flowerDistance?: number;
  @Column({ name: 'blmg_size' })
  flowerSize?: number;
  @Column({ name: 'watr_type' })
  wateringType?: number;
  @Column({ name: 'flow_qnty' })
  wateringAmount?: number;
  @Column({ name: 'grth_dtl' })
  vigor?: number;

  @Column({ name: 'create_user' })
  createUser?: string;
  @Column({ name: 'update_user' })
  updateUser?: string;

  @Column({ name: 'CREATE_DT' })
  createDt?: Date;
  @Column({ name: 'UPDATE_DT' })
  updateDt?: Date;

  @BeforeInsert()
  beforeInsert() {
    const now = new Date();
    this.createDt = now;
    this.updateDt = now;
  }

  @BeforeUpdate()
  beforeUpdate() {
    const now = new Date();
    this.updateDt = now;
  }

}
