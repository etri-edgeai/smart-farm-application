import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CroppingSeason } from "./cropping-season.entity";
import { Crop } from "./crop.entity";
import { Breed } from "./breed.entity";

@Entity({ name: 'crop_breed_list' })
export class CropBreed {
  @PrimaryGeneratedColumn({ name: 'CROP_BREED_IDX', comment: '일련번호' })
  idx?: number;

  @Column({ name: 'CROP_CD', comment: '작물코드' })
  cropIdx?: number;

  @Column({ name: 'BREED_CD', comment: '품종코드' })
  breedIdx?: number;

  @OneToMany(() => CroppingSeason, (croppingSeason) => croppingSeason.cropBreed)
  @JoinColumn({ name: "BREED_CD" })
  croppingSeasons?: CroppingSeason[];

  @OneToOne(() => Breed)
  @JoinColumn({ name: "BREED_CD" })
  breed?: Breed;

  @OneToOne(() => Crop)
  @JoinColumn({ name: "CROP_CD" })
  crop?: Crop;
}
