import { DataSource } from "typeorm";
import { Dong } from "./dong.entity";

export const DongRepository = (dataSource: DataSource) => 
    dataSource.getRepository(Dong).extend({
      async getDeviceIdByDongId(dongId: number) {
        const rs = await this.createQueryBuilder()
            .select("in_env_device_idx")
            .where("farm_dong_idx = :dongId", {dongId: dongId})
            .getRawOne();
        
        return rs['in_env_device_idx']
      }
    });

/* @EntityRepository(FarmDong)
export class FarmDongRepository extends Repository<FarmDong> {
   
  async getDeviceIdByDongId(dongId: number) {
    const rs = await this.createQueryBuilder()
        .select("in_env_device_idx")
        .where("farm_dong_idx = :dongId", {dongId: dongId})
        .getRawOne();
    
    return rs['in_env_device_idx']
  }
} */