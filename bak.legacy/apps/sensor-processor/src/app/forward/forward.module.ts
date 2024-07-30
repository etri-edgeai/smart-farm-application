import { COMMON } from '@libs/db';
import { Forward } from '@libs/db';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForwardService } from './forward.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Forward], COMMON),
  ],
  providers: [ForwardService],
  exports: [ForwardService]
})
export class ForwardModule {}
