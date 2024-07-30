import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'refresh_token' })
export class RefreshToken {
  @PrimaryColumn({ name: 'REFRESH_TOKEN' })
  refreshToken: string;

  @Column({ name: 'EXPIRES_IN' })
  expiresIn: Date;
}
