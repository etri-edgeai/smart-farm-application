import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'


@Entity({ name: 'culture_medium_cd' })
export class CultureMdedium {
  @PrimaryGeneratedColumn({ name: 'CM_CD', comment: '배지 코드' })
  idx: number;

  @Column({ name: 'CM_NM', comment: '배지명', nullable: false })
  name: string;
}