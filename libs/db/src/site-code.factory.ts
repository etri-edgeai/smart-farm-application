import { REQUEST } from "@nestjs/core";
import { SITE_CODE } from "./constants"; // .에서 import하면 오류발생

export const siteCodeFactory = {
  provide: SITE_CODE,
  useFactory: (payload) => {
    return payload?.headers?.siteCode || payload?.data?.headers.siteCode || payload?.data?.siteCode;
  },
  inject: [REQUEST]
}
