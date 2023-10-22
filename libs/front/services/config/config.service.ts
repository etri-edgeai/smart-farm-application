import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { merge } from 'lodash-es';
import { FRONT_APP_CONFIG } from '@front/services/config/config.constants';
import { ApiService } from '../api.service';
import { SiteConfig } from '@libs/models';
import { AppConfig } from './app.config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FrontConfigService {
  [x: string]: any;
  appName: string;
  private _config: BehaviorSubject<any>; // ui config
  private _siteConfig: BehaviorSubject<SiteConfig> = new BehaviorSubject(null); // site config

  constructor(
    @Inject(FRONT_APP_CONFIG) config: AppConfig,
    private _apiService: ApiService,
    private _router: Router
  ) {
    this._config = new BehaviorSubject(config);
  }

  set config(value: Partial<AppConfig>) {
    // Merge the new config over to the current config
    const config = merge({}, this._config.getValue(), value);
    this._config.next(config);
  }

  get config() {
    return this._config.getValue();
  }

  get config$(): Observable<AppConfig> {
    return this._config.asObservable();
  }

  set siteConfig(siteConfig: SiteConfig) {
    const _config = {};
    if (siteConfig.theme) _config['theme'] = siteConfig.theme;
    if (siteConfig.schemeDark != null) _config['scheme'] = siteConfig.schemeDark ? 'dark' : 'light';
    this.config = _config;

    this._siteConfig.next(siteConfig);
  }

  get siteConfig() {
    return this._siteConfig.getValue();
  }

  get siteConfig$() {
    return this._siteConfig.asObservable();
  }

  getSiteConfig() {
    return this._apiService.req<SiteConfig>('site-config', {}).pipe(
      tap(siteConfig => {
        this.siteConfig = siteConfig;
        const clientIp = siteConfig.clientIp;

        // ip 제한이 있으면 no access page로 redirect한다
        const allowedIps: string[] = siteConfig.allowedIps?.split(",").map(ip => ip.trim());
        // if (clientIp != '::1' && allowedIps && allowedIps.length > 0 && !allowedIps.some(ip => clientIp.includes(ip))) {
        // if (clientIp != '::1' && allowedIps && allowedIps.length > 0 && !ipRangeCheck(clientIp, allowedIps)) {
        if (allowedIps) {
          allowedIps.push('::1');
        }
        /*
        if (allowedIps && allowedIps.length > 0 && !ipRangeCheck(clientIp, allowedIps)) {
          this._router.navigateByUrl('/access-denied');
        }
        */
      })
    )
  }

  reset(): void {
    this._config.next(this.config);
  }
}
