import { Global, Module } from "@nestjs/common";
import { SITE_CODE, SITE_CONFIG, TENANT_DATASOURCE } from "./constants";
import { DbModule } from "./db.module";
import { tenantFactory } from "./tenant.factory";
import { siteCodeFactory } from "./site-code.factory";
import { siteConfigFactory } from "./site-config.factory";

@Global()
@Module({
  imports: [DbModule],
  providers: [tenantFactory, siteCodeFactory, siteConfigFactory],
  exports: [TENANT_DATASOURCE, SITE_CODE, SITE_CONFIG]
})
export class TenantModule {}
