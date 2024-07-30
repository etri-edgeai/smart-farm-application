import { DataSource } from "typeorm";
import { SdExternal } from "./sd-external.entity";
import { SdhExternal } from "./sdh-external.entity";

export const SdExternalRepository = (dataSource: DataSource) => 
    dataSource.getRepository(SdExternal).extend({
      async createBySensor(sdhExternal: SdhExternal) {
        let sdEx = await this.findOne({ where: { deviceIdx: sdhExternal.deviceIdx }});
        if (!sdEx) {
          sdEx = this.create();
          sdEx.deviceIdx = sdhExternal.deviceIdx;
        }
    
        sdEx.preIdx = sdEx.lastIdx;
        sdEx.lastIdx = sdhExternal.idx;
    
        return sdEx;
      }
    });

/* @EntityRepository(SdExternal)
export class SdExternalRepository extends Repository<SdExternal> {
  private readonly logger = new Logger(SdExternalRepository.name);
  public static all = new Map<number, SdExternal>(); // device_idx, sdinternal

  public async createBySensor(sdhExternal: SdhExternal) {
    let sdEx = SdExternalRepository.all.get(sdhExternal.deviceIdx);
    if (!sdEx) {
      sdEx = await this.findOne({ where: { deviceIdx: sdhExternal.deviceIdx }});
      if (!sdEx) {
        sdEx = this.create();
        sdEx.deviceIdx = sdhExternal.deviceIdx;
      }
    }

    sdEx.preIdx = sdEx.lastIdx;
    sdEx.lastIdx = sdhExternal.idx;

    return sdEx;
  }
} */