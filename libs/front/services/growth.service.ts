import { Injectable } from "@angular/core";
import { GrowthDto, GrowthPropertyDto, UpdateGrowthPropertyDto } from "@libs/models";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: 'root',
})
export class GrowthService {

  constructor(private api: ApiService) {}

  getProperties() {
    return this.api.req<GrowthPropertyDto[]>('growth/properties');
  }

  saveProperties(data: UpdateGrowthPropertyDto[]) {
    return this.api.req('growth/update-properties', data);
  }

  getGrowthList() {
    return this.api.req('growth/list');
  }

  getGrowth(csIdx: number) {
    return this.api.req<GrowthDto>('growth', { csIdx });
  }
}
