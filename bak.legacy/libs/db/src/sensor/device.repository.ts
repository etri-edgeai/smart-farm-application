import { DataSource } from "typeorm";
import { Device } from "./device.entity";

export const DeviceRepository = (dataSource: DataSource) => 
    dataSource.getRepository(Device).extend({
      async getMaxIdx(serverId: number|string) {
        const lowerIdx = +`${serverId}0000`;
        const upperIdx = +`${serverId}9999`;
    
        const rs = await dataSource.createQueryBuilder()
            .select("MAX(device_idx)", "maxIdx")
            .where("device_idx between :lower and :upper", {lower: lowerIdx, upper: upperIdx})
            .getRawOne();
    
        return rs['maxIdx'];
      },
    
      async getLatLng(idx: number) {
        const sql = `SELECT farm_latitude, farm_longitude FROM farm f, farm_dong fd, device d 
          WHERE d.device_idx = ${idx} 
          AND (fd.culture_medium_device_idx = d.device_idx OR fd.ext_weather_device_idx = d.device_idx OR fd.in_env_device_idx = d.device_idx)
          AND f.farm_idx = fd.farm_idx
          limit 1 `;
        const rs = await dataSource.query(sql);
        let lat;
        let lng;
        if (rs.length > 0) {
          lat = rs[0]['farm_latitude'];
          lng = rs[0]['farm_longitude'];
        }
        return {lat, long: lng};
      }
    });

/* @EntityRepository(Device)
export class DeviceRepository extends Repository<Device> {
  async getMaxIdx(serverId: number|string) {
    const lowerIdx = +`${serverId}0000`;
    const upperIdx = +`${serverId}9999`;

    const rs = await this.createQueryBuilder()
        .select("MAX(device_idx)", "maxIdx")
        .where("device_idx between :lower and :upper", {lower: lowerIdx, upper: upperIdx})
        .getRawOne();

    return rs['maxIdx'];
  }

  async getLatLng(idx: number) {
    const sql = `SELECT farm_latitude, farm_longitude FROM farm f, farm_dong fd, device d 
      WHERE d.device_idx = ${idx} 
      AND (fd.culture_medium_device_idx = d.device_idx OR fd.ext_weather_device_idx = d.device_idx OR fd.in_env_device_idx = d.device_idx)
      AND f.farm_idx = fd.farm_idx
      limit 1 `;
    const rs = await this.query(sql);
    let lat;
    let lng;
    if (rs.length > 0) {
      lat = rs[0]['farm_latitude'];
      lng = rs[0]['farm_longitude'];
    }
    return {lat, long: lng};
  }

} */