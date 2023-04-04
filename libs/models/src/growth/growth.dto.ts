import { DateUtils } from "@libs/utils";
import { Expose } from "class-transformer";
import { Moment } from "moment";

export class GrowthOld2Dto {
  @Expose()
  idx: number;
  @Expose()
  name: string;
}

export abstract class AbstractGrowth {
  csIdx?: number;     // 작기번호
  invDt?: Date;        // 조사일
  sampleId?: string;   // 샘플번호
  farmIdx?: number;    // 농장번호
  week?: number;       // 주 차수
  cropCd?: number;     // 작물
  breedCd?: number;    // 품종
}

export class GrowthOldDto extends AbstractGrowth {
  idx?: number;
  status?: number;
  plantHeight?: number;
  weekGrowth?: number;
  stemThick?: number;
  leafLength?: number;
  leafWidth?: number;
  leafCount?: number;
  flowerLocation?: number;
  stemFlowerDistance?: number;
  flowerDistance?: number;
  flowerSize?: number;
  wateringType?: number;
  wateringAmount?: number;
  vigor?: number;
}

export class GrowthDto {
  idx?: number;        // 일련번호
  csIdx?: number;      // 작기번호
  invDt?: string;        // 조사일
  week?: number;        // 주차
  sampleId?: string;   // 샘플번호
  farmIdx?: number;    // 농장번호
  cropIdx?: number;     // 작물
  breedIdx?: number;    // 품종

  plantHeight?: number;
  nodeDistance?: number;
  stemDiameter?: number;
  leafLen?: number;
  leafWidth?: number;
  leafCount?: number;
  flowerClusterCount?: number;
  flowerClusterHeight?: number;
  flowerClusterDistance?: number;
  flowerClusterStemDiameter?: number;
  flowerStemDistance?: number;
  flowerCount?: number;
  fruitCount?: number;
  fruitCluster?: number;
  fruitLen?: number;
  fruitWidth?: number;
  harvestCount?: number;
  harvestCluster?: number;
  harvestWeight?: number;
  createUser?: string;
  updateUser?: string;

  getWeeks?() {
    if (this.invDt)
      return DateUtils.toMoment(this.invDt).weeks();
    else
      return null;
  }
}
