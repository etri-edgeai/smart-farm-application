import { CommService } from '@libs/comm';
import { CommonConfigService } from '@libs/config';
import { DbService } from '@libs/db';
import { AppInfo, SiteConfig } from '@libs/models';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  beApps: AppInfo[] = [];
  feApps: AppInfo[] = [];
  hostMap = new Map<string, string[]>(); // sitecode - hosts

  constructor(private commService: CommService, private config: CommonConfigService, private dbService: DbService) {}

  onModuleInit() {
    // this.commService.requestAppInfo();

    const appListString = this.config.config.get<string>('APP_LIST');
    let appList = [];
    if (appListString) {
      appList = appListString.split(',').map(a => a.replace(" ", ""));
    }

    const frontendListString = this.config.config.get<string>('FRONTEND_LIST');
    let frontendList = [];
    if (frontendListString) {
      frontendList = frontendListString.split(',').map(a => a.replace(" ", ""));
    }

    for (const be of appList) {
      this.beApps.push({ name: be });
    }

    for (const fe of frontendList) {
      const r = this.config.config.get<string>(fe.toUpperCase() + "_ROUTES").split(',').map(a => a.replace(" ", ""));
      this.feApps.push({ name: fe, routes: r});
    }

    this.loadHosts();
  }

  setAppInfo(appInfo: AppInfo) {
    if (!appInfo) return;

    const beApp = this.beApps.find(be => be.name == appInfo.name);
    if (beApp) {
      beApp.version = appInfo.version;
      beApp.lastResponse = new Date();
    }
  }

  /**
   * system.conf 의 설정을 읽어서 hostMap에 로드
   */
  loadHosts() {
    const codes = this.config.config.get<string>('SITE_LIST').split(',').map(code => code.replace(" ", ""));
    for (const code of codes) {
      const hostListString = this.config.config.get<string>(code.toUpperCase() + '_HOST_LIST');
      if (!hostListString) continue;

      const hosts = hostListString.split(',').map(host => host.toLowerCase().replace(" ", ""));
      Logger.log(`Load hosts - siteCode: ${code}, hosts: ${hosts}`);

      this.hostMap.set(code.toLowerCase(), hosts);
    }
  }

  async siteConfig(headers: any) {
    const siteCode = headers.siteCode ? headers.siteCode : this.getSiteCode(headers.host);
    const siteConfig = new SiteConfig();
    siteConfig.code = siteCode;
    siteConfig.clientIp = headers.realIp;

    try {
      const ds = await this.dbService.getDataSourceByCode(siteCode);
      if (ds) {
        const rs = await ds.query("select * from site_option");

        for (let r of rs) {
          if (r.id.endsWith('_b')) continue; // '_b' 로 끝나는건 임시 혹은 백업 항목이라 무시한다
          // db에는 모두 string으로 들어가는데, 그 값이 숫자인 경우 number로 변환한다
          if (Number.isNaN(Number(r.value))) {
            siteConfig[r.id] = r.value;
          } else {
            siteConfig[r.id] = +r.value;
          }
        }
      }
    } catch (e) {
      Logger.error(e);
    }

    Logger.debug("siteConfig: " + JSON.stringify(siteConfig));

    return siteConfig;
  }

  /**
   * client에서 header에 박아서 오는 host값으로 siteCode를 구한다
   * @param host
   * @returns siteCode
   */
  getSiteCode(host: string) {
    if (!host) return null;

    for(const code of this.hostMap.keys()) {
      const hosts = this.hostMap.get(code);
      const matched = hosts.find(_host => host.indexOf(_host) >= 0);
      if (matched) return code;
    }

    return this.hostMap.size > 0 ? this.hostMap.keys().next().value : null; // 매치되는게 없으면 첫번째 siteCode를 반환함. 개발서버등에서 사용할 목적.
  }

}
