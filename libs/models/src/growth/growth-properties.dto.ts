import { CropDto } from "../farm";

export class GrowthPropertyDto {
  code: string;
  name: string;
  alias?: string[];
  unit: string;
  priority?: number;
  crops?: number[];
  afterPinchDisabled?: boolean;
  predictable?: boolean;
}

export class UpdateGrowthPropertyDto {
  code: string;
  crops: number[];
}

export class GrowthCropPropertiesDto {
  crops: CropDto[];
  growthProperties: GrowthPropertyDto[];
}
