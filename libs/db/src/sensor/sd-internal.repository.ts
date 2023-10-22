import { DataSource } from "typeorm";
import { SdInternal } from "./sd-internal.entity";
import { SdhInternal } from "./sdh-internal.entity";

export const SdInternalRepository = (dataSource: DataSource) => 
    dataSource.getRepository(SdInternal).extend({
      async createBySensor(sdhInternal: SdhInternal) {
          let sdIn = await this.findOne({ where: { deviceIdx: sdhInternal.deviceIdx }});
          if (!sdIn) {
            sdIn = this.create();
            sdIn.deviceIdx = sdhInternal.deviceIdx;
          }
  
        sdIn.preIdx = sdIn.lastIdx;
        sdIn.lastIdx = sdhInternal.idx;
        sdIn.lastSensingDt = sdhInternal.sensingDt;
        sdIn.isSunrise = sdhInternal.isSunrise;
  
        return sdIn;
      }
    });

/*
export class SdInternalRepository {
  public static all = new Map<number, SdInternal>(); // device_idx, sdinternal

  public static getRepository(ds: DataSource) {
    return ds.getRepository(SdInternal).extend({
      async createBySensor(sdhInternal: SdhInternal) {
      let sdIn = SdInternalRepository.all.get(sdhInternal.deviceIdx);
      if (!sdIn) {
        sdIn = await this.findOne({ where: { deviceIdx: sdhInternal.deviceIdx }});
        if (!sdIn) {
          sdIn = this.create();
          sdIn.deviceIdx = sdhInternal.deviceIdx;
        }
      }

      sdIn.preIdx = sdIn.lastIdx;
      sdIn.lastIdx = sdhInternal.idx;
      sdIn.lastSensingDt = sdhInternal.sensingDt;
      sdIn.isSunrise = sdhInternal.isSunrise;

      return sdIn;
    }
  });
  }
}
*/

/*
@EntityRepository(SdInternal)
export class SdInternalRepository extends Repository<SdInternal> {
  public static all = new Map<number, SdInternal>(); // device_idx, sdinternal

  public async createBySensor(sdhInternal: SdhInternal) {
    let sdIn = SdInternalRepository.all.get(sdhInternal.deviceIdx);
    if (!sdIn) {
      sdIn = await this.findOne({ where: { deviceIdx: sdhInternal.deviceIdx }});
      if (!sdIn) {
        sdIn = this.create();
        sdIn.deviceIdx = sdhInternal.deviceIdx;
      }
    }

    sdIn.preIdx = sdIn.lastIdx;
    sdIn.lastIdx = sdhInternal.idx;
    sdIn.lastSensingDt = sdhInternal.sensingDt;
    sdIn.isSunrise = sdhInternal.isSunrise;

    return sdIn;
  }
}
*/
