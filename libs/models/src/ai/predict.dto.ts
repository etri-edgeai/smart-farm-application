export class PredictEnvOptionsDto {
  inDeviceIdx?: number;
  exDeviceIdx?: number;
  time?: string; // 'yyyy-mm-dd hh:mm:ss'
}
export class PredictInputDto {
  modelId: string;
  params: any;
  data: any;
}

export abstract class AbstractPredictOptions {}

export class PredictEnvRequestDto extends AbstractPredictOptions {
  deviceIdx: number;
  time?: string; // 'yyyy-mm-dd hh:mm:ss'
}

export class PredictGrowthRequestDto extends AbstractPredictOptions {
  csIdx: number;
  sampleId: string;
  baseDate: string;
}

export class PredictGrowthResponseDto {
  csIdx: number; // 작기
  sampleId: string; // 샘플id
  lastInvDt: string; // 마지막 조사일
  predictDate?: string; // 예측대상일
  plantHeight?: number; // 초장
  stemDiameter?: number; // 줄기굵기
  leafLen?: number; // 잎길이
  leafWidth?: number; // 입폭
  //weekLengthDiff: number; // 주간생육길이
  harvestWeight?: number; // 수확과중
}
