import { CommExceptionFilter } from '@libs/comm';
import { CreateDeviceDto, DeviceFarmRequestDto, UpdateGrowthPropertyDto, UpdateUserDto, UpdateFarmDto, UpdateCroppingSeasonDto } from '@libs/models';
import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeviceService } from './device.service';

import { FarmService } from './farm.service';
import { GrowthService } from './growth.service';
import { SensingService } from './sensing.service';
import { UserService } from './user.service';
import { EquipmentService } from './equipment.service';
import { WateringService } from './watering.service';
import { CultureMediumService } from './culture-medium.service';
import { CropBreedService } from './crop-breed.service';


// TODO: pattern이 많아지면 서비스별로 controller도 나눌 필요가 있다.
@UseFilters(new CommExceptionFilter())
@Controller()
export class AppController {
  constructor(
    private devicesService: DeviceService,
    private farmService: FarmService,
    private sensingService: SensingService,
    private wateringService: WateringService,
    private growthService: GrowthService,
    private cropBreedService: CropBreedService,
    private equipmentService: EquipmentService,
    private readonly userService: UserService,
    private cultureMediumService: CultureMediumService,
  ) { }

  @MessagePattern('users.list')
  getUsers() {
    return this.userService.getUsers();
  }

  @MessagePattern('user.update')
  @UsePipes(ValidationPipe)
  updateUser(@Payload('body') dto: UpdateUserDto): Promise<void> {
    return this.userService.updateUser(dto);
  }


  // device

  @MessagePattern('device.list')
  getDevices(@Payload('body') data: any) {
    return this.devicesService.getDevices(data);
  }

  @MessagePattern('device.byIdx')
  getDeviceByIdx(@Payload('body') data: any) {
    return this.devicesService.getDeviceByIdx(data);
  }

  @MessagePattern('device.models')
  getDeviceModels() {
    return this.devicesService.getDeviceModels();
  }

  @MessagePattern('device.save')
  saveDevice(@Payload('body') data: CreateDeviceDto) {
    return this.devicesService.saveDevice(data);
  }

  @MessagePattern('device.saveFarm')
  saveDeviceFarm(@Payload('body') data: DeviceFarmRequestDto) {
    return this.devicesService.saveFarm(data);
  }

  @MessagePattern('device.delete')
  deleteDevice(@Payload('body') data: any) {
    return this.devicesService.deleteDevice(data.idx);
  }

  @MessagePattern('farm.list')
  getFarmList(@Payload('body') data: any) {
    return this.farmService.getFarmList(data);
  }

  @MessagePattern('farm.delete')
  deleteFarm(@Payload('body') data: any) {
    return this.farmService.deleteFarm(data);
  }

  @MessagePattern('farm.shared')
  getSharedFarms(@Payload('body') data: any) {
    return (data && data.idx) && this.farmService.getSharedFarms(data.idx);
  }

  @MessagePattern('farm.sharedIn')
  getSharedInFarms(@Payload('body') data: any) {
    return (data && data.sharedUserIdx) && this.farmService.getSharedInFarms(data.sharedUserIdx);
  }

  @MessagePattern('farm.sharedOut')
  getSharedOutFarms(@Payload('body') data: any) {
    return (data && data.ownerIdx) && this.farmService.getSharedOutFarms(data.ownerIdx);
  }

  @MessagePattern('farm.updateEquipments')
  saveEquipments(@Payload('body') data: any){
    return this.farmService.saveEquipments(data.idx, data.equipmentCd);
  }

  @MessagePattern('farm.multipleLists')
  getMultipleLists(@Payload('body') data: any){
    return this.farmService.getMultipleLists(data);
  }

  @MessagePattern('equipments.list')
  getEquipments() {
    return this.equipmentService.getEquipments();
  }

  @MessagePattern('cropBreed.list')
  async getCropBreeds(@Payload('body') data: any) {
    return await this.cropBreedService.getCropBreeds(data.idx);
  }

  @MessagePattern('crop.list')
  async getCrops() {
    return await this.cropBreedService.getCrops();
  }

  @MessagePattern('crop.list.idx')
  async getCropsByIdx(@Payload('body') data: any) {
    return await this.cropBreedService.getCropsByIdx(data.idx);
  }

  @MessagePattern('breed.list')
  async getBreeds() {
    return await this.cropBreedService.getBreeds();
  }

  @MessagePattern('breed.list.idx')
  async getBreedByIdx(@Payload('body') data: any) {
    return await this.cropBreedService.getBreedByIdx(data.idx);
  }

  @MessagePattern('farm.updateSeason')
  @UsePipes(ValidationPipe)
  async updateSeason(@Payload('body') dto: UpdateCroppingSeasonDto) {
    console.log("dto: ", dto);
    return await this.farmService.updateSeason(dto);
  }

  @MessagePattern('farm.deleteSeason')
  async deleteSeason(@Payload('body') form: any) {
    return await this.farmService.deleteSeason(form);
  }

  @MessagePattern('farm.croppingSeasonsAndGrowthCounts')
  getCroppingSeasonsAndGrowthCounts(@Payload('body') data: any) {
    return this.farmService.getCroppingSeasons(data);
  }

  @MessagePattern('farm.croppingSeasonsAndGrowthInvDt')
  getCroppingSeasonsAndGrowthInvDt(@Payload('body') data: any) {
    return this.farmService.getCroppingSeasonsAndGrowthInvDt(data);
  }

  @MessagePattern('farm.farm')
  getLastUltraSrtNcst(@Payload('body') data: any) {
    return this.farmService.getFarmByUserId(data.farmIdx);
  }

  @MessagePattern('farm.cultureMedium')
  getCultureMediums(@Payload('body') data: any) {
    return this.cultureMediumService.getCultureMediums(data);
  }

  // 센서데이터

  @MessagePattern('sensing.env')
  getFarmEnv(@Payload('body') data: any) {
    return this.sensingService.getEnvs(data);
  }

  @MessagePattern('sensing.lastInternal')
  getLastInternal(@Payload('body') data: any) {
    return this.sensingService.getLastInternal(data.deviceIdx);
  }

  @MessagePattern('sensing.waterLevel')
  getWaterLevel(@Payload('body') data: any) {
    return this.sensingService.getWaterLevel(data);
  }

  /*
  @MessagePattern('sensing.vegetativeReproductive')
  getVegetativeReproductive(@Payload('body') data: any) {
    return this.sensingService.getVegetativeReproductive(data.farmIdx);
  }
  */

  @MessagePattern('sensing.tempBySun')
  getTempBySun(@Payload('body') data: any) {
    return this.sensingService.getTempBySun(data.deviceIdx, data.date);
  }

  // 급배액

  @MessagePattern('watering.report')
  getWateringReport(@Payload('body') data: any) {
    return this.wateringService.getWateringReport(data.farmDongIdx, data.inDeviceIdx, data.cmDeviceIdx, data.dayKey);
  }

  @MessagePattern('watering.sensor')
  getWateringSensor(@Payload('body') data: any) {
    return this.wateringService.getSensor(data.dripperNum, data.inDeviceIdx, data.cmDeviceIdx, data.dayKey);
  }

  @MessagePattern('watering.minMaxMoistureContent')
  getMinMaxCmHumidity(@Payload('body') data: any) {
    return this.wateringService.getMinMaxMoistureContent(data.deviceIdx, data.dayKey);
  }

  @MessagePattern('watering.todayWatering')
  getWateringDrainage(@Payload('body') data: any) {
    return this.wateringService.getWateringDrainage(data.dripperNum, data.inDeviceIdx, data.cmDeviceIdx, data.dayKey);
  }

  @MessagePattern('watering.byHd')
  getbyHd(@Payload('body') data: any) {
    return this.wateringService.getSensor(data.dripperNum, data.inDeviceIdx, data.cmDeviceIdx, data.dayKey);
  }

  @MessagePattern('watering.weightDiff')
  getWeightDiff(@Payload('body') data: any) {
    return this.wateringService.getWeightDiff(data.deviceIdx, data.dayKey);
  }

  // growth
  @MessagePattern('growth')
  getGrowth(@Payload('body') data) {
    return this.growthService.getGrowth(data);
  }

  @MessagePattern('growth.save')
  saveGrowth(@Payload('body') data) {
    return this.growthService.saveGrowth(data);
  }

  @MessagePattern('growth.delete')
  deleteGrowth(@Payload('body') data) {
    return this.growthService.deleteGrowth(data);
  }

  @MessagePattern('growth.properties')
  getGrowthProperty() {
    return this.growthService.getGrowthProperty();
  }

  @MessagePattern('growth.updateProperties')
  updateGrowthProperty(@Payload('body') data: UpdateGrowthPropertyDto[]) {
    return this.growthService.updateProperties(data);
  }

  /*
  @MessagePattern('growth.growthCropProperties')
  getGrowthCropProperties() {
    return this.growthService.getGrowthCropProperties();
  }
  */


}
