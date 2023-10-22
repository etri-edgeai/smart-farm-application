import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Farm } from "./farm.entity";
import { User } from "../user";

@Entity({ name: 'shared_farm' })
export class SharedFarm {
  @PrimaryGeneratedColumn({ name: 'IDX', comment: '일련번호' })
  idx?: number;

  @Column({ name: 'FARM_IDX' })
  farmIdx: number; // 공유한 농장

  @Column({ name: 'OWNER_IDX' })
  ownerIdx: number; // 공유한 유저
  
  @Column({ name: 'SHARED_USER_IDX' })
  sharedUserIdx: number; // 공유받은 유저

  @ManyToOne(() => Farm)
  @JoinColumn({ name: 'FARM_IDX' })
  farm: Farm;

  @ManyToOne(() => User, user => user)
  @JoinColumn({ name: 'SHARED_USER_IDX' })
  sharedUser: User;

  @ManyToOne(() => User, user => user)
  @JoinColumn({ name: 'OWNER_IDX' })
  owner: User;
}