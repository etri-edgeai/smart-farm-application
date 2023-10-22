import { CommonConfigModule } from '@libs/config';
import { Module, Global } from '@nestjs/common';
import { CommOptionsService } from './comm-options.service';
import { CommController } from './comm.controller';
import { CommService } from './comm.service';
import { RolesGuard } from './guards';

/**
 * microservice에 send할 때 필요한 모듈
 */
@Global()
@Module({
  imports: [CommonConfigModule],
  controllers: [CommController],
  providers: [CommOptionsService, CommService,
    {
      provide: 'REDIS',
      useFactory: (commOptionsService: CommOptionsService) => { return commOptionsService.getClientProxy(); },
      inject: [CommOptionsService],
    },
    RolesGuard
  ],
  exports: [CommonConfigModule, CommOptionsService, CommService, 'REDIS', RolesGuard]
})
export class CommModule {}
