import { Injectable } from "@angular/core";
import { FarmDto } from "@libs/models";
import { BehaviorSubject } from "rxjs";
import { ApiService } from "./api.service";

/**
 * 센서 데이터 취급 service
 */
@Injectable({
  providedIn: 'root',
})
export class SensingService {
  private _farm: BehaviorSubject<FarmDto> = new BehaviorSubject<FarmDto>(null);

  constructor(private api: ApiService) {}

  getLastInternal(deviceIdx: number) {
    return this.api.req("sensing/last-internal", { deviceIdx: deviceIdx });
  }

  getLastExternal(deviceIdx: number) {

  }

  getSensingItem(deviceIdx: number, type: string, item: string) {

  }
}
