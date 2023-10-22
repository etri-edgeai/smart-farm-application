import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Crop, Growth, GrowthProperty, TENANT } from "@libs/db";
import { GrowthCropPropertiesDto, UpdateGrowthPropertyDto } from "@libs/models";
import { plainToInstance } from "class-transformer";

@Injectable()
export class GrowthService {
  constructor(
    @InjectRepository(Crop, TENANT) private cropRepo: Repository<Crop>,
    @InjectRepository(GrowthProperty, TENANT) private gpRepo: Repository<GrowthProperty>,
    @InjectRepository(Growth, TENANT) private growthRepo: Repository<Growth>,
  ) { }

  getGrowthProperty() {
    return this.gpRepo.find({order: {priority: 'ASC'}});
  }

  getGrowth(data: any) {
    return this.growthRepo.find({where: {csIdx: data.csIdx}, order: {createDt: 'DESC'}});
  }

  saveGrowth(data: any[]) {
    data.forEach(d => {
      delete d['createDt'];
      delete d['updateDt'];
    })
    const entity = plainToInstance(Growth, data);
    return this.growthRepo.save(entity);
  }

  deleteGrowth(data: number[]) {
    return this.growthRepo.delete(data);
  }

  updateProperties(data: UpdateGrowthPropertyDto[]) {
    for (let row of data) {
      const crops = row.crops.join(',');
      this.gpRepo.update(row.code, {_crops: crops});
    }
    return 'success';
  }

  async getGrowthCropProperties() {
    const cropPromise = this.cropRepo.find();
    const gpPromise = this.gpRepo.find();

    const [crops, gp] = await Promise.all([cropPromise, gpPromise]);

    const res = new GrowthCropPropertiesDto();
    res.crops = crops;

    return res;
  }

}
