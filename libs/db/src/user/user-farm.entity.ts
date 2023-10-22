import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Farm } from '../farm';
@Entity({ name: 'user_farm' })
export class UserFarm {
  @PrimaryGeneratedColumn({ name: 'USER_FARM_IDX', comment: '일련번호' })
  idx?: number;

  @Column({ name: 'USER_IDX', comment: '회원번호' })
  userIdx?: number;

  @Column({ name: 'FARM_IDX', comment: '농장번호' })
  farmIdx?: number;

  @Column({ name: 'FARM_OWNER', comment: '소유자여부' })
  owner?: boolean;

  @Column({ name: 'MAIN_FARM_FLAG', comment: '메인농장여부' })
  isMain?: boolean;

  @Column({ name: 'FARM_CONFIRM_DT', comment: '확인날짜' })
  confirmDt?: Date;

  @Column({ name: 'FARM_SHARE_DT', comment: '공유날짜' })
  shareDt?: Date;

  @Column({ name: 'FARM_UNSHARE_DT', comment: '공유해제날짜' })
  unshareDt?: Date;

  @OneToMany(() => Farm, (farm) => farm.userFarm)
  farms?: Farm[];
}
