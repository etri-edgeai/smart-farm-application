import { Injectable } from "@angular/core";
import { PredictGrowthResponseDto } from "@libs/models";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: 'root',
})
export class AiService {
  constructor(private _apiService: ApiService) {}

  /**
   * 작기의 모든 샘플 생육, 수확 예측
   * @param csIdx 작기번호
   */
  predictGrowth(csIdx: number) {
    return this._apiService.req<PredictGrowthResponseDto[]>('ai/predictGrowth', { csIdx });
  }

}