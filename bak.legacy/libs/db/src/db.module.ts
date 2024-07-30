import { CommonConfigModule } from '@libs/config';
import { Module, Global } from '@nestjs/common';
import { COLLECT, COMMON } from './constants';
import { DbService } from './db.service';

@Global()
@Module({
  imports: [CommonConfigModule],
  providers: [
    {provide: COMMON, useValue: COMMON},
    {provide: COLLECT, useValue: COLLECT},
    DbService
  ],
  exports: [COMMON, COLLECT, DbService]
})
export class DbModule {}
