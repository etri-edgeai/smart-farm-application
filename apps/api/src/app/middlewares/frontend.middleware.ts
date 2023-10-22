
import { CommonConfigService } from '@libs/config';
import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const allowedExt = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.otf',
  '.ttf',
  '.svg',
];

// TODO: routes를 얻어서 자동으로 아래 값을 얻도록 하는게 좋겠다
// 참고: https://stackoverflow.com/questions/58255000/how-can-i-get-all-the-routes-from-all-the-modules-and-controllers-available-on
const apis = [
  'api', 'connfarm', 'device', 'timestamp'
]

const resolvePath = (param:string, file: string) => path.resolve(path.join(__dirname, '..', param, file));
const resolveCommonFilePath = (param:string, file: string) => path.resolve(path.join(param, file));

@Injectable()
export class FrontendMiddleware implements NestMiddleware {
  constructor(private config: CommonConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { url } = req;
    const param1 = url.split('/')[1];

      // it starts with /api or /connfarm --> continue with execution
    //if (url.indexOf('api') === 1 || url.indexOf('connfarm') === 1 || url.indexOf('device') === 1) {
    if (apis.some(api => param1 == api)) {
      next();
    } else {
      if (url.startsWith("/files")) {
        // 공용 file
        res.sendFile(resolveCommonFilePath(this.config.commonResourceDir, url));

      } else if (allowedExt.filter(ext => url.indexOf(ext) > 0).length > 0) {
        // it has a file extension --> resolve the file
        // res.sendFile(resolvePath("admin", url));
        res.sendFile(resolvePath("/", url));
      } else {
        // in all other cases, redirect to the index.html!
        const appPath = (param1 == 'system') ? param1 : 'admin';
        const file = resolvePath(appPath, 'index.html');
        if (fs.existsSync(file)) {
          res.sendFile(file);
        } else {
          throw new NotFoundException();
        }
      }
    }
  }
}
