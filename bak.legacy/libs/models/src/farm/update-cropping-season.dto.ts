import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateCroppingSeasonDto {
  @IsOptional()
  @IsNumber()
  tempIdx: number;

  @IsNotEmpty()
  @IsNumber()
  farmIdx: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  memo: string;

  @IsNotEmpty()
  @IsNumber()
  numberPlantedHills: number;

  @IsNotEmpty()
  @IsNumber()
  cropIdx: number;

  @IsNotEmpty()
  @IsNumber()
  breedIdx: number;

  @IsOptional()
  @IsNumber()
  cropBreedIdx: number;

  @IsNotEmpty()
  @IsDateString()
  startDt: Date;

  @IsOptional()
  @IsDateString()
  endDt: Date | null;

  @IsOptional()
  @IsDateString()
  pinchDt: Date | null;

  @IsOptional()
  @IsDateString()
  deleteDt: Date | null;

  @IsNotEmpty()
  @IsNumber()
  cultureMediumCode: number;

  @IsNotEmpty()
  @IsBoolean()
  recycle: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isNew: boolean;
}