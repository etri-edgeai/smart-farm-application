import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { TENANT, User }  from '@libs/db';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from '@libs/models';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, TENANT)
    private userRepo: Repository<User>,
  ) { }

  async getUsers() {
    return await this.userRepo.find({where: { deleteDt: IsNull(), active: true }});
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<any> {
    const { idx, phone, memo } = updateUserDto;
    return await this.userRepo.update(idx, { phone, memo });
  }
}