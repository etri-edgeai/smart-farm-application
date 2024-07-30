import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonConfigService } from './common-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [CommonConfigService.getAppConfigFile(), CommonConfigService.getConfigFile()],
    })
  ],
  providers: [CommonConfigService],
  exports: [CommonConfigService],
})
export class CommonConfigModule {}
