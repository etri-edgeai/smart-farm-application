import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { SharedFarm } from "../farm";

@Entity({ name: 'user_info', synchronize: false })
export class User {
  public static readonly Role = {
      SUPER_ADMIN: 'SUPER_ADMIN',
      ADMIN: 'ADMIN',
      USER: 'USER',
      PAID_USER: 'PAID_USER',
      // AGRICULTURAL_CENTER: 'AGRICULTURAL_CENTER',
      MENTOR: 'MENTOR',
      // BUSINESS_PARTNER: 'BUSINESS_PARTNER',
  };

  public static readonly AuthType = {
      LOCAL: 'LOCAL',
      KAKAO: 'KAKAO',
      NAVER: 'NAVER',
      GOOGLE: 'GOOGLE',
  };

  @PrimaryGeneratedColumn({ name: 'USER_IDX', comment: '일련번호' })
  idx?: number;
  @Column({ name: 'INSTALL_ID', comment: '앱설치번호' })
  installId?: number;
  @Column({ name: 'ACTIVE', comment: '활성여부' })
  active?: boolean;
  @Column({ name: 'USER_ETTINGS', comment: '세팅번호' })
  userSettingsId?: number;
  @Column({ name: 'USER_ID', comment: '아이디' })
  userId?: string;
  @Column({ name: 'USER_PASS', comment: '패스워드' })
  password?: string;
  @Column({ name: 'USER_NAME', comment: '이름' })
  name?: string;
  @Column({ name: 'USER_EMAIL', comment: '메일계정' })
  email?: string;
  @Column({ name: 'ROLE', comment: '' })
  role?: string;
  @Column({ name: 'MATCHING_LIMIT', comment: '매칭제한수' })
  matchingLimit?: number;
  @Column({ name: 'USER_PHONE1', comment: '폰번호' })
  phone?: string;
  @Column({ name: 'USER_MEMO', comment: '메모' })
  memo?: string;
  @Column({ name: 'CREATE_DT', comment: '가입일자' })
  createDt?: Date;
  @Column({ name: 'DELETE_DT', comment: '삭제날짜' })
  deleteDt?: Date;

  @OneToMany(() => SharedFarm, sharedFarm => sharedFarm)
  owner: SharedFarm[];

  @OneToMany(() => SharedFarm, sharedFarm => sharedFarm)
  sharedUser: SharedFarm[];
}