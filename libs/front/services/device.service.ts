import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { CreateDeviceDto, DeviceDto, DeviceFarmRequestDto, DeviceModelDto } from "@libs/models";

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  constructor(private api: ApiService) {}

  getDeviceModels() {
    return this.api.req<DeviceModelDto[]>('device/models');
  }

  saveDevice(device: CreateDeviceDto) {
    return this.api.req<DeviceDto>('device/save', device);
  }

  saveDeviceFarm(data: DeviceFarmRequestDto) {
    return this.api.req<any>('device/save-farm', data);
  }

  /**
   * device 삭제(deleteDt 세팅)
   * @param idx deviceIdx
   * @returns
   */
  deleteDevice(idx: number) {
    return this.api.req('device/delete', {idx});
  }

}
