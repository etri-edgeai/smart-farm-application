import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CommService } from './comm.service';

@Controller()
export class CommController {
  constructor(private commService: CommService) {}

  @EventPattern('comm.appInfo')
  appInfo() {
    this.commService.emitAppInfo();
  }

}
