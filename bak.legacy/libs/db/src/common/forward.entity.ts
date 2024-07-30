import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 센서데이터 포워딩 정보
 */
@Entity({ name: 'forward' })
export class Forward {
  @PrimaryGeneratedColumn({ comment: '일련번호' })
  id: number;
  @Column({ comment: 'host' })
  host: string
  @Column({ comment: 'comma seperated serial. regular ex.'})
  serials: string;
  @Column({ comment: 'enabled'})
  enabled: boolean;
  @Column({ comment: '설명'})
  description: string;
  @Column({ name: "create_dt", comment: '생성일'})
  createDt: Date;
  @Column({ name: "modify_dt", comment: '수정일'})
  modifyDt: Date;
}
