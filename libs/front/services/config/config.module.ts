import { ModuleWithProviders, NgModule } from '@angular/core';
import { FrontConfigService } from '@front/services/config/config.service';
import { FRONT_APP_CONFIG } from '@front/services/config/config.constants';

@NgModule()
export class FrontConfigModule {
  constructor(private _FrontConfigService: FrontConfigService) {}

  /**
   * forRoot method for setting user configuration
   *
   * @param config
   */
  static forRoot(config: any): ModuleWithProviders<FrontConfigModule> {
    return {
      ngModule: FrontConfigModule,
      providers: [
        {
          provide: FRONT_APP_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
