import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'equipment_cd', synchronize: false })
export class Equipment {

  @PrimaryGeneratedColumn({ name: 'EQUIP_CD', comment: '장비 코드' })
    idx?: number;

  @Column({ name: 'EQUIP_NM', comment: '장비명' })
    name?: string;

}