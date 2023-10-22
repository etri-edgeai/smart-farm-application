import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TENANT }  from '@libs/db';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipment } from '@libs/db/farm/equipment.entity';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment, TENANT)
    private equipmentRepo: Repository<Equipment>
  ) { }

  getEquipments() {
    return this.equipmentRepo.find();
  }
}