import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'breed_cd' })
export class Breed {
  @PrimaryGeneratedColumn({ name: 'BREED_CD' })
  idx: number;

  @Column({ name: 'BREED_NM' })
  name: string;
}
