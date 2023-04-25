import { Injectable } from "@angular/core";
import { CropDto } from "@libs/models";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: 'root',
})
export class CropService {
  //private _farm: BehaviorSubject<FarmDto> = new BehaviorSubject<FarmDto>(null);

  constructor(private api: ApiService) {}

  getCrops() {
    return this.api.req<CropDto[]>('crop/list');
  }
}
