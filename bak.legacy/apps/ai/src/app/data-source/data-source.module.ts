import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SdhCultureMedium, SdhExternal, SdhInternal } from '@libs/db/sensor';
import { typeormOptions } from '@libs/db'
import { DbService } from './db.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeormOptions),
    TypeOrmModule.forFeature([SdhInternal, SdhExternal, SdhCultureMedium])
  ],
  providers: [DbService],
  exports: [DbService, TypeOrmModule]
})
export class DataSourceModule {}
