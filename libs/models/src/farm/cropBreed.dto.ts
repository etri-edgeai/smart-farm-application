import { BreedDto } from "./breed.dto";
import { CropDto } from "./crop.dto";

export class CropBreedDto {
  idx?: number;
  cropIdx?: number;
  breedIdx?: number;
  crop?: CropDto;
  breed?: BreedDto;
}
