import { CommonConfigService } from "@libs/config";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { DataSource, DataSourceOptions, EntityTarget, ObjectLiteral } from "typeorm";
import { Forward, Tenant } from "./common";
import { COMMON } from "./constants";
import { Crop, CroppingSeason, Farm, Dong, DongVentWatering, SharedFarm, Equipment } from "./farm";
import { CropBreed } from "./farm/crop-breed.entity";
import { FlowerLog, Growth, GrowthLog, GrowthProperty } from "./growth";
import { Device, DeviceLocation, SdCultureMedium, SdExternal, SdhCultureMedium, SdhExternal, SdhInternal, SdInternal, SensorOrgData, WaterLevel } from "./sensor";
import { typeormFactory } from "./typeorm-options";
import { User, UserFarm } from "./user";
import { DeviceModel } from "./sensor/device-model.entity";
import { Breed } from "./farm/breed.entity";
import { CultureMdedium } from "./farm/culture-medium.entity";

export const COMMON_ENTITIES = [Tenant, Forward];
export const TENANT_ENTITIES = [
  Equipment, DeviceModel, CultureMdedium, DeviceLocation,
  User, UserFarm, Farm, Dong, SharedFarm,
  Crop, Breed, CropBreed, CroppingSeason, GrowthProperty, GrowthLog, FlowerLog, Growth,
  SdhInternal, SdhExternal, SdhCultureMedium, SdInternal, SdExternal, SdCultureMedium, WaterLevel,
  DongVentWatering,
  Device, DeviceModel, SensorOrgData,
];
export const TENANTS_CACHE = 'tenants';

@Injectable()
export class DbService {
  private dataSourcesByCode = new Map<string, DataSource>();
  private dataSources = new Map<string, DataSource>();

  constructor(private config: CommonConfigService) {}

  /**
   * Connection을 가져오거나 없으면 만든다
   * @param name database or database token
   * @param entities
   * @returns
   */
  async getDataSource(name?: string, entities?: any[]) {
    let ds = this.dataSources.get(name || 'default');

    if (!ds) {
      // TODO: entities를 여기서 설정하도록, 혹은 autoload하도록
      let concatedEntities = [];
      if (name == COMMON) {
        concatedEntities = COMMON_ENTITIES;
      } else {
        concatedEntities = TENANT_ENTITIES.concat(entities);
      }
      ds = new DataSource({...typeormFactory(this.config, name), entities: concatedEntities} as DataSourceOptions);
      this.dataSources.set(name || "default", ds);
    }

    if (!ds.isInitialized) {
      await ds.initialize();
    }

    return ds;
  }

  async getDataSourceByCode(siteCode?: string, entities?: any[]) {
    let ds = this.dataSourcesByCode.get(siteCode);
    if (ds) return ds;

    // siteCode가 없을 경우 어떻게 처리할 것인지 결정해야 한다. 현재는 default로 처리한다
    let dbName = "default";

    if (siteCode && this.config.multiTenancyEnabled) {
      // TODO: tenant는 추가는 거의 없는 일로 간주하고 map 에 넣고 쓰는게 좋을 것 같다. 5 ~ 10분에 한 번 refresh하고..
      const commonDs = await this.getDataSource(COMMON);
      const tenant = await Tenant.getTenantByCode(commonDs, siteCode);
      if (!tenant) {
        throw new RpcException('No tenant for ' + siteCode);
      }
      dbName = tenant.dbName;
    }

    ds = await this.getDataSource(dbName, entities);
    this.dataSourcesByCode.set(siteCode || "default", ds);

    return ds;
  }

  /**
   * 요렇게 extend 해서 사용한다는데, 현재 이 function은 사용되고 있지는 않음
   * @param dataSource
   * @param target
   * @returns
   */
  getCustomRepository<Entity extends ObjectLiteral>(dataSource: DataSource, target: EntityTarget<Entity>) {
    return dataSource.getRepository(target).extend({});
  }

  async getTenants() {
    let tenants: Tenant[];

    if (this.config.multiTenancyEnabled) {
      const ds = await this.getDataSource(COMMON);
      const tenantRepo = ds.getRepository(Tenant);
      tenants = await tenantRepo.find({cache: {id: TENANTS_CACHE, milliseconds: 5 * 60 * 1000}}); // 5분 cache
    } else {
      const tenant = new Tenant();
      tenant.dbName = this.config.db.database;
      tenant.code = this.config.siteCode;
      tenant.latitude = this.config.lat;
      tenant.longitude = this.config.lng;
      tenants = [tenant];
    }

    return tenants;
  }
}

