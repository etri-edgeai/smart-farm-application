import { Injectable } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { CultureMdedium, TENANT }  from '@libs/db';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CultureMediumService {
  constructor(
    @InjectRepository(CultureMdedium, TENANT)
    private cultureMediumRepo: Repository<CultureMdedium>
  ) { }

  async getCultureMediums(data?: any) {
    return await this.cultureMediumRepo.findBy({
      name: Not('null')
    });
  }
}