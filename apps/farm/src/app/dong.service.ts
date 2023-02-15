import { Dong, TENANT } from '@libs/db';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class DongService {
  constructor(@InjectRepository(Dong, TENANT) private dongRepo: Repository<Dong>) {
  }

  async getDongByFarmId(farmIdx: number) {
    const rs = await this.dongRepo.find({where: {farmIdx: farmIdx, deleteDt: IsNull()}});
    return rs.map(r => {
      return {
        idx: r.idx,
        inDeviceIdx: r.inDeviceIdx,
        exDeviceIdx: r.exDeviceIdx,
        cmDeviceIdx: r.cmDeviceIdx,
        isMain: r.main,
        active: r.active,
      }
    })
  }

  async getFarmDongByUserId(farmIdx: number) {
    /*
    const rs = await this.farmDongRepo.find({where: {idx: farmIdx}});
    return rs.map(r => {
      return {
        idx: r.idx,
        name: r.name,
      }
    })
    */
  }

}
