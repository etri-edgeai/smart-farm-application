import { Module } from '@nestjs/common';
import { CommModule } from '@libs/comm';
import { DataSourceModule } from './data-source/data-source.module';
import { MlModule } from './ml/ml.module';
import { KbModule } from './kb/kb.module';

@Module({
  imports: [CommModule, DataSourceModule, MlModule, KbModule]
})
export class AppModule {}
