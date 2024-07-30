import { FarmDto } from './farm.dto';

export class CroppingSeasonDto {
  idx?: number;
  farmIdx?: number;
  farm: FarmDto;
  name?: string;
  numberPlantedHills?: number;
  memo?: string;
  cropIdx?: number;
  breedIdx?: number;
  cropBreedIdx?: object;
  cropName?: string;
  breedName?: string;
  cultureMediumCode?: number;
  recycle?: boolean;
  startDt?: Date;
  endDt?: Date;
  pinchDt?: Date; // 적심일
  active?: boolean;
  lastInvDt?: string; // growth로부터 추가로 구한 값
}
