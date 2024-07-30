export class WateringReportDto {
  yDate: string;
  yTotalSupplyCount: number;
  yTotalSupply: number;
  yTotalDrainage: number;
  yFirstSupplyTime: string;
  yWateringRecommendTime: string;
  yMinMoistureContent: number;
  yMaxMoistureContent: number;

  tDate: string;
  tFirstSupplyTime: string;
  tWateringRecommendTime: string;
  tMinMoistureContent: number;

  lastThreeDaysMinMoistureContent: number;
  weightDiff: number;
}