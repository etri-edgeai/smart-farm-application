import { IsNumber, IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsNumber()
  idx?: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(11, { message: 'phon-short' })
  @MaxLength(11, { message: 'phon-long' })
  phone: string;

  @IsOptional()
  @IsString()
  memo: string;
}