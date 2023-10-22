import { Exclude, Expose } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CropBreed } from './crop-breed.entity';
import { Farm } from './farm.entity';

@Entity({ name: 'farm_cropping_season' })
export class CroppingSeason {
  @PrimaryGeneratedColumn({ name: 'FCS_IDX', comment: '일련번호' })
  idx?: number;

  @Column({ name: 'FARM_IDX', comment: '농장번호' })
  farmIdx?: number;

  @Column({ name: 'FCS_NAME', comment: '농장명' })
  name?: string;

  @Column({ name: 'FCS_NOPH', comment: '작기 재식주수' })
  numberPlantedHills?: number;

  @Column({ name: 'FCS_MEMO', comment: '작기 메모' })
  memo?: string;

  @Column({ name: 'CROP_BREED_IDX', comment: '작물 품종 정보 테이블' })
  cropBreedIdx?: number;

  @Column({ name: 'CM_CD', comment: '배지 정보 테이블' })
  cultureMediumCode?: number;

  @Column({ name: 'CM_RECYCLE', comment: 'recycle 여부' })
  recycle?: boolean;

  @Column({ name: 'CREATE_DT', comment: '생성날짜' })
  createDt?: Date;

  @Column({ name: 'MODIFY_DT', comment: '수정날짜' })
  updateDt?: Date;

  @Column({ name: 'DELETE_DT', comment: '삭제날짜', default: null, nullable: true })
  deleteDt?: Date | null;

  @Column({ name: 'START_DT', comment: '작기 시작일' })
  startDt?: Date;

  @Column({ name: 'END_DT', comment: '작기 종료일' })
  endDt?: Date;

  @Column({ name: 'PINCH_DT', comment: '적심일' })
  pinchDt?: Date;

  @Column({ name: 'ACTIVE', comment: '활성여부' })
  active?: boolean;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => CropBreed, (cropBreed) => cropBreed.croppingSeasons)
  @JoinColumn({ name: "CROP_BREED_IDX" })
  cropBreed?: CropBreed;

  @ManyToOne(() => Farm)
  @JoinColumn({ name: "FARM_IDX" })
  farm?: Farm;

  // cropBreed에서 필요한건 cropIdx이기 때문에 dto등 model에서는 cropBreed를 없애고 cropIdx를 expose하여 사용한다
  @Expose()
  get cropIdx() {
    return this.cropBreed ? this.cropBreed.cropIdx : null;
  }

  @Expose()
  get breedIdx() {
    return this.cropBreed ? this.cropBreed.breedIdx : null;
  }

  @Expose()
  get cropName() {
    return this.cropBreed ? this.cropBreed.crop.name : null;
  }

  // cropBreed에서 필요한건 cropIdx이기 때문에 dto등 model에서는 cropBreed를 없애고 cropIdx를 expose하여 사용한다
  @Expose()
  get breedName() {
    return this.cropBreed ? this.cropBreed.breed.name : null;
  }

  @BeforeInsert()
  beforeInsert() {
    this.active = true;
    this.createDt = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    console.log("1. date: ", new Date());
    console.log("2. date: ", new Date().toISOString());

    this.updateDt = new Date();
    this.active = (this.endDt || this.deleteDt) ?
      null :
      true;

    this.endDt = this.active ?
      null :
      (this.endDt ? this.endDt : new Date());

    console.log("3. date: ", this.endDt);
  }
}
