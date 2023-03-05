import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { Request } from 'express';
import rawbody from 'raw-body';
import { AppInfo, SiteConfig } from '@libs/models'
import { CommonConfigService } from '@libs/config';

/**
 * passport에서 req.body를 참조하여 username, password를 가져오므로,
 * 어쩔 수 없이 data.body 형태로 만들어 data를 던져야 한다
 */
@Injectable()
export class CommService {
  // TODO: 일종의 cache인데, 갱신(5분마다?)이 필요하다
  siteConfigs = new Map<string, SiteConfig>();

  constructor(@Inject('REDIS') private redis: ClientProxy) {}

  // 현재 사용하고 있지는 않음
  send(cmd: string, data: any, siteCode?: string, realIp?: string, time = 30000) {
    if (siteCode) {
      data['sitecode'] = siteCode;
    }
    if (realIp) {
      data['realIp'] = realIp;
    }

    return this.redis.send(cmd, data).pipe(timeout(time));
  }

  async sendRequest(req: Request, cmd?: string) {
    if (!cmd) {
      cmd = this.kebabToCamel(req.params.module);
      let param1 = this.kebabToCamel(req.params.param1);
      let param2 = this.kebabToCamel(req.params.param2);
      if (param1) cmd += '.' + param1;
      if (param2) cmd += '.' + param2;
    }

    const data = {headers: CommService.getSimpleHeaders(req), body: req.body}
    Logger.debug(req.method + ' ' + req.originalUrl + " " + cmd + " " + JSON.stringify(data));

    return this.redis.send(cmd, data).pipe(timeout(120 * 1000)); // 120초
  }

  async sendOldRequest(req: Request, cmd?: string) {
    if (!cmd) {
      cmd = this.kebabToCamel(req.params.module);
      let param1 = this.kebabToCamel(req.params.param1);
      let param2 = this.kebabToCamel(req.params.param2);
      if (param1) cmd += '.' + param1;
      if (param2) cmd += '.' + param2;
    }

    const data = {headers: CommService.getSimpleHeaders(req), body: req.body.data}
    Logger.debug(req.method + ' ' + req.originalUrl + " " + JSON.stringify(data));

    return this.redis.send(cmd, data).pipe(timeout(120 * 1000)); // 120초
  }

  static getSimpleHeaders(req: Request) {
    const realIp = req.headers['x-real-ip'] || req.ip.replace("::ffff:", "");
    const siteCode = req.headers['x-site-code'] || req.headers['site-code'] as string;
    const authorization = req.headers['authorization'] as string;
    const host = req.headers['origin'] || req.headers['host'];

    const headers = {siteCode, realIp, authorization, host};
    Object.assign(headers, req.query);

    return headers;
  }

  emitAppInfo() {
    const data: AppInfo = {
      name: CommonConfigService.getAppName(),
      version: CommonConfigService.getVersion()
    };
    this.redis.emit('system.appInfo', data);
  }

  requestAppInfo() {
    this.redis.emit('comm.appInfo', {});
  }

  /**
   * url은 kebab으로 작성하는데, microservice의 cmd는 camelcase 이기 때문에 변환한다
   * @param path kebab case string
   * @returns camel case string
   */
  kebabToCamel(path: string) {
    if (!path) return null;
    return path.replace(/-./g, x=>x[1].toUpperCase());
  }

  /**
   * raw body 혹은 parsed body를 구한다
   * TODO: static으로 바꿀까?
   * @param req
   * @returns
   */
  async getJsonBody(req: Request) {
    if (req.readable) {
      // body is ignored by NestJS -> get raw body from request
      const raw = await rawbody(req);
      const text = raw.toString().trim();
      if (text == '') {
        return null;
      }
      try {
        const body = JSON.parse(text);
        // realIp등 HeaderMiddleware에서 추가된 body가 있을 수 있으므로 끼워 넣는다
        Object.assign(body, req.body);
        return body;
      } catch (e: any) {
        throw new Error(e.message + ": " + text);
      }
    } else {
      return req.body;
    }
  }

  async getSiteConfig(siteCode: string) {
    let siteConfig = this.siteConfigs.get(siteCode);
    if (!siteConfig) {
      siteConfig = await lastValueFrom(this.send('siteConfig', {headers: {siteCode: siteCode}}));
      this.siteConfigs.set(siteCode, siteConfig);
    }
    return siteConfig;
  }
}
