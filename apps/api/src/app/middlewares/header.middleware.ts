import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const realIp = req.headers['x-real-ip'] || req.ip.replace("::ffff:", "");
    let siteCode = req.headers['x-site-code'] || req.headers['site-code'] as string;
    const accessToken = req.headers['authorization'] as string;
    if (realIp) req.body['realIp'] = realIp;
    if (siteCode) req.body['siteCode'] = siteCode;
    if (accessToken) req.body['accessToken'] = accessToken.replace('Bearer ', '');

    // siteCode가 없는 경우 hostname에서 구한다(ex: smartta => ta)
    // TODO: tenant에 hostname들을 입력해 놓고 구해와야 하지만, 일단 이렇게 해놓는다
    if (!siteCode) {
      let host = req.headers['origin'] || req.headers['host'];
      req.body['host'] = host;

      /*
      try {
        const hostname = new URL(host).hostname;
        if (hostname && hostname != 'localhost' && hostname != 'api') {
          const servername = hostname.split('.')[0];
          siteCode = servername.substring(servername.length - 2);
          if (!isNaN(+siteCode)) {
            siteCode = null;
          }
        }
      } catch (e) {
        // passthrough. host가 ip:port인 경우 new URL(host) 에서 에러남. ip는 필요없으므로 skip
      }
      */
    }

    next();
  }
}
