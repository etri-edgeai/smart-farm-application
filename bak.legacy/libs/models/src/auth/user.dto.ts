import { Expose } from "class-transformer";

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  PAID_USER = 'PAID_USER',
  MENTOR = 'MENTOR'
}

export class UserDto {
  @Expose()
  idx: number;
  @Expose()
  userId: string;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  phone: string;
  @Expose()
  avatar?: string;
  @Expose()
  role: Role;
  @Expose()
  status?: string;
}