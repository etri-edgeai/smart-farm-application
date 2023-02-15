import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Farm, TENANT, User, UserFarm }  from '@libs/db';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, TENANT) private userRepo: Repository<User>,
    @InjectRepository(Farm, TENANT) private farmRepo: Repository<Farm>,
    @InjectRepository(UserFarm, TENANT) private userFarmRepo: Repository<UserFarm>
  ) { }

  async findOne(query: FindOptionsWhere<User>) {
    const user = await this.userRepo.findOneBy(query);
    return user;
  }

  async findFarm(userIdx: number) {
    const userFarm = await this.userFarmRepo.findOne({where: {userIdx: userIdx}});
    if (userFarm) {
      return await this.farmRepo.findOne({where: {idx: userFarm.farmIdx}, relations: {dongs: true}});
    }
    return null;
  }

  async getUsers() {
    console.log("user.service", this.userRepo.find());
    return this.userRepo.find();
  }

}