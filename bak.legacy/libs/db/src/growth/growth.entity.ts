import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'growth_log' })
export class Growth_old {
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

  growthJson: string;

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

@Entity({ name: 'growth' })
export class Growth {
  @PrimaryGeneratedColumn({ name: 'idx'})
  idx?: number;

  @Column({ name: 'fcs_idx' })
  csIdx: number;
  @Column({ name: 'inv_dt' })
  invDt: Date; // ex) '2023-04-25'
  @Column({ name: 'week' })
  week: number;
  @Column({ name: 'sample_id' })
  sampleId: string;
  @Column({ name: 'farm_idx' })
  farmIdx: number;
  @Column({ name: 'crop_idx' })
  cropIdx?: number;
  @Column({ name: 'breed_idx' })
  breedIdx?: number;

  @Column({ name: 'plant_height', type: 'float' })
  plantHeight?: number;
  @Column({ name: 'node_distance', type: 'float' })
  nodeDistance?: number;
  @Column({ name: 'stem_diameter', type: 'float' })
  stemDiameter?: number;
  @Column({ name: 'leaf_len', type: 'float' })
  leafLen?: number;
  @Column({ name: 'leaf_width', type: 'float' })
  leafWidth?: number;
  @Column({ name: 'leaf_count', type: 'float' })
  leafCount?: number;
  @Column({ name: 'flower_cluster_Count', type: 'float' })
  flowerClusterCount?: number;
  @Column({ name: 'flower_cluster_height', type: 'float' })
  flowerClusterHeight?: number;
  @Column({ name: 'flower_cluster_distance', type: 'float' })
  flowerClusterDistance?: number;
  @Column({ name: 'flower_cluster_stem_diameter', type: 'float' })
  flowerClusterStemDiameter?: number;
  @Column({ name: 'flower_stem_distance', type: 'float' })
  flowerStemDistance?: number;
  @Column({ name: 'flower_count', type: 'float' })
  flowerCount?: number;
  @Column({ name: 'fruit_count', type: 'float' })
  fruitCount?: number;
  @Column({ name: 'fruit_cluster', type: 'float' })
  fruitCluster?: number;
  @Column({ name: 'fruit_len', type: 'float' })
  fruitLen?: number;
  @Column({ name: 'fruit_width', type: 'float' })
  fruitWidth?: number;
  @Column({ name: 'harvest_count', type: 'float' })
  harvestCount?: number;
  @Column({ name: 'harvest_cluster', type: 'float' })
  harvestCluster?: number;
  @Column({ name: 'harvest_weight', type: 'float' })
  harvestWeight?: number;
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
    delete this.createUser;
    delete this.createDt;
    this.updateDt = now;
  }


}
