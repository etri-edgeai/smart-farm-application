import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FrontMediaWatcherModule } from '@front/services/media-watcher/media-watcher.module';
import { FusePlatformModule } from '@front/services/platform/platform.module';
import { FuseUtilsModule } from '@front/services/utils/utils.module';
import { MaterialModule } from '@front/material/material.module';
import { TranslocoCoreModule } from './transloco/transloco.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { FuseAlertModule } from './components/alert/alert.module';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FrontMediaWatcherModule,
    FusePlatformModule,
    FuseUtilsModule,
    TranslocoCoreModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [],
  providers: [
    {
      // Disable 'theme' sanity check
      provide: MATERIAL_SANITY_CHECKS,
      useValue: {
        doctype: true,
        theme: false,
        version: true,
      },
    },
    {
      // Use the 'fill' appearance on Angular Material form fields by default
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill',
      },
    },
  ],
  exports: [MaterialModule]
})
export class FrontModule {
  constructor(@Optional() @SkipSelf() parentModule?: FrontModule) {
    if (parentModule) {
      throw new Error('FrontModule has already been loaded. Import this module in the AppModule only!');
    }
  }
}
