import { Expose } from 'class-transformer';

export class PredictInternalSelfDto {
  input: any[][];
  pred: number[];
}