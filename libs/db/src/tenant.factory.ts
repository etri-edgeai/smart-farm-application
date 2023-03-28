import { REQUEST } from "@nestjs/core";
import { EntitiesMetadataStorage } from "@nestjs/typeorm/dist/entities-metadata.storage";
import { TENANT, TENANT_DATASOURCE } from "./constants";
import { DbService } from "./db.service";

export const tenantFactory = {
  provide: TENANT_DATASOURCE,
  useFactory: (payload, dbService: DbService) => {
    let siteCode = payload?.headers?.siteCode || payload?.data?.headers.siteCode || payload?.data?.siteCode;
    const entities = EntitiesMetadataStorage.getEntitiesByDataSource(TENANT); // TypeormModule의 autoLoadEntities 옵션 구현
    return dbService.getDataSourceByCode(siteCode, entities);
  },
  inject: [REQUEST, DbService]
}
