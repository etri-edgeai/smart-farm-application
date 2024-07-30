import { NgModule } from '@angular/core';
import { FrontMediaWatcherService } from '@front/services/media-watcher/media-watcher.service';

@NgModule({
  providers: [FrontMediaWatcherService],
})
export class FrontMediaWatcherModule {
  /**
   * Constructor
   */
  constructor(private _frontMediaWatcherService: FrontMediaWatcherService) {}
}
