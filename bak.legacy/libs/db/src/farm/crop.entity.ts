import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CropBreed } from './crop-breed.entity';

@Entity({ name: 'crop_cd' })
export class Crop {
  @PrimaryGeneratedColumn({ name: 'CROP_CD' })
  idx: number;

  @Column({ name: 'CROP_IMAGE_URL' })
  imageUrl?: string;

  @Column({ name: 'CROP_NM' })
  name: string; 
}
