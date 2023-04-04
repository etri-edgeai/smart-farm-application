import { Expose, Type } from "class-transformer";
import { DongDto } from "./dong.dto";

export class FarmDto {
  @Expose()
  idx: number;

  @Expose()
  name: string;
  
  @Expose()
  @Type(() => DongDto)
  dongs?: DongDto[];
}