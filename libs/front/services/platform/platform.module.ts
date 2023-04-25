import { NgModule } from '@angular/core';
import { FrontPlatformService } from '@front/services/platform/platform.service';

@NgModule({
  providers: [FrontPlatformService],
})
export class FusePlatformModule {
  /**
   * Constructor
   */
  constructor(private _frontPlatformService: FrontPlatformService) {}
}
