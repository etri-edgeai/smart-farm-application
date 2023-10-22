import { Crop, Breed, TENANT, CropBreed } from '@libs/db';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';


@Injectable()
export class CropBreedService {
  constructor(
    @InjectRepository(CropBreed, TENANT)
    private cropBreedRepo: Repository<CropBreed>,

    @InjectRepository(Crop, TENANT)
    private cropRepo: Repository<Crop>,
    
    @InjectRepository(Breed, TENANT)
    private breedRepo: Repository<Breed>,
  ) { }

  async getCropBreeds(idx: number){
    return await this.cropBreedRepo.find({
      relations: ['crop', 'breed'],
      where: {
        cropIdx: idx
      }
    });
  }
  
  async getCrops() {
    return await this.cropRepo.findBy({ name: Not('null') });
  }

  async getCropsByIdx(idx: number) {
    return await this.cropRepo.findOne({
      where: { idx }
    });
  }

  async getBreeds(){
    return await this.breedRepo.findBy({ name: Not('null') });
  }

  async getBreedByIdx(idx: number) {
    return await this.breedRepo.findOne({
      where: { idx }
    });
  }
}