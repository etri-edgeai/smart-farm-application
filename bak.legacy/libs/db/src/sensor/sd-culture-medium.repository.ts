import { DataSource } from "typeorm";
import { SdCultureMedium } from "./sd-culture-medium.entity";
import { SdhCultureMedium } from "./sdh-culture-medium.entity";

export const SdCultureMediumRepository = (dataSource: DataSource) => 
    dataSource.getRepository(SdCultureMedium).extend({
      async createBySensor(sdhCultureMedium: SdhCultureMedium) {
        let sdCu = await this.findOne({ where: { deviceIdx: sdhCultureMedium.deviceIdx }});
        if (!sdCu) {
          sdCu = this.create();
          sdCu.deviceIdx = sdhCultureMedium.deviceIdx;
        }

        sdCu.preIdx = sdCu.lastIdx;
        sdCu.lastIdx = sdhCultureMedium.idx;
    
        return sdCu;
      }
    });

/*
//@EntityRepository(SdCultureMedium)
@CustomRepository(SdCultureMedium)
export class SdCultureMediumRepository extends Repository<SdCultureMedium> {
  private readonly logger = new Logger(SdCultureMediumRepository.name);
  public static all = new Map<number, SdCultureMedium>(); // device_idx, sdinternal

  public async createBySensor(sdhCultureMedium: SdhCultureMedium) {
    let sdCu = SdCultureMediumRepository.all.get(sdhCultureMedium.deviceIdx);
    if (!sdCu) {
      sdCu = await this.findOne({ where: { deviceIdx: sdhCultureMedium.deviceIdx }});
      if (!sdCu) {
        sdCu = this.create();
        sdCu.deviceIdx = sdhCultureMedium.deviceIdx;
      }
    }

    sdCu.preIdx = sdCu.lastIdx;
    sdCu.lastIdx = sdhCultureMedium.idx;

    return sdCu;
  }
}
*/