import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { AppInfo } from '@libs/models';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('system.appInfo')
  appInfo(@Payload('body') data: AppInfo) {
    this.appService.setAppInfo(data);
  }

  @MessagePattern('siteConfig')
  siteConfig(@Payload('headers') headers: any) {
    return this.appService.siteConfig(headers);
  }

}
