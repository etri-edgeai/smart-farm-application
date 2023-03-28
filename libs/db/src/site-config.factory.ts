import { REQUEST } from "@nestjs/core";
import { SITE_CONFIG } from "./constants"; // .에서 import하면 오류발생
import { CommService } from "@libs/comm";

export const siteConfigFactory = {
  provide: SITE_CONFIG,
  useFactory: (payload, commService: CommService) => {
    let siteCode = payload?.headers?.siteCode || payload?.data?.headers.siteCode || payload?.data?.siteCode;
    return commService.getSiteConfig(siteCode);
  },
  inject: [REQUEST, CommService]
}
