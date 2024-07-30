import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, IsNumberString, Max, Min } from "class-validator";

export class UpdateFarmDto {
  @IsOptional()
  @IsString()
  @Matches(/ROAD{1}|PARCEL{1}/)
  addCategory: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'dong-limit' })
  @Max(99, { message: 'dong-limit' })
  dongCount: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/S{1}|M{1}/, { message: 'dong-type' })
  dongType: string;

  @IsOptional()
  @IsBoolean()
  isNew: boolean;
 
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  pyung: number;

  @IsNotEmpty()
  @IsNumberString()
  emdCode: string;

  @IsNotEmpty()
  @IsNumberString()
  sggCode: string;

  @IsNotEmpty()
  @IsNumberString()
  sidoCode: string;

  @IsNotEmpty()
  @IsNumber()
  squareMeter: number;

  @IsOptional()
  @IsNumber()
  tempIdx: number;

  @IsOptional()
  @IsNumber()
  idx: number;

  @IsNotEmpty()
  @IsNumber()
  userIdx: number;

  @IsOptional()
  @IsNumber()
  uiMainDongIdx: number;
}