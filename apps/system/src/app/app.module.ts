import { CommModule } from '@libs/comm';
import { DbModule } from '@libs/db';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CommModule, DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
