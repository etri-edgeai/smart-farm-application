import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DongDto, FarmDto, CroppingSeasonDto, Role, UserDto } from "@libs/models";
import { BehaviorSubject, lastValueFrom, Observable, tap } from "rxjs";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: 'root',
})
export class FarmService {
  /*
  private _farms = new BehaviorSubject<FarmDto[]>(null);
  private _menteeFarms = new BehaviorSubject<FarmDto[]>(null);
  private _sharedFarms = new BehaviorSubject<FarmDto[]>(null);
  */
  constructor(private _apiService: ApiService) {}

  getFarmList(role: Role = Role.SUPER_ADMIN, userIdx?: number, withDongs = false) {
    return this._apiService.req<FarmDto[]>('farm/list', {role: role, userIdx: userIdx, withDongs: withDongs});
  }

  getCroppingSeasonsAndGrowthInvDt(farms?: [], searchString?: string) {
    return this._apiService.req<CroppingSeasonDto[]>('farm/cropping-seasons-and-growth-inv-dt', {farmIdxes: farms});
  }

  /*
  set farms(value: FarmDto[]) {
    this._farms.next(value);
  }

  get farms() {
    return this._farms.getValue();
  }

  get farms$(): Observable<FarmDto[]> {
    return this._farms.asObservable();
  }

  set menteeFarms(value: FarmDto[]) {
    this._farms.next(value);
  }

  get menteeFarms() {
    return this._menteeFarms.getValue();
  }

  get menteeFarms$(): Observable<FarmDto[]> {
    return this._menteeFarms.asObservable();
  }

  set sharedFarms(value: FarmDto[]) {
    this._farms.next(value);
  }

  get sharedFarms() {
    return this._sharedFarms.getValue();
  }

  get sharedFarms$(): Observable<FarmDto[]> {
    return this._sharedFarms.asObservable();
  }

  getUserFarmList(role: Role = Role.SUPER_ADMIN, userIdxes: number[]) {
    return this._apiService.req<FarmDto[]>('farm/list', {role: role, userIdxes: userIdxes}).pipe(tap((res:any) => {
      this.farms = res.userFarms;
      this.menteeFarms = res.menteeFarms;
      this.sharedFarms = res.sharedFarms;
    }));
  }

  getFarmList(role: Role = Role.SUPER_ADMIN, userIdxes: number[]) {
    return this._apiService.req<FarmDto[]>('farm/list', {role: role, userIdxes: userIdxes});
  }

  getDongList(role: Role = Role.SUPER_ADMIN, userIdx?: number) {
    return this._apiService.req<FarmDongDto[]>('farm/dong-list', {role: role, userIdx: userIdx, withFarm: true});
  }
  */

}
