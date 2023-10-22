import { Overlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { RouterModule } from '@angular/router';
import { CropService, GrowthService } from '@front';
import { MaterialModule } from '@front/material/material.module';
import { GrowthChartComponent } from './growth-chart/growth-chart.component';
import { GrowthPropertyComponent } from './growth-properties.component';
import { GrowthComponent } from './growth.component';
import { growthRoutes } from './growth.routing';
import { GrowthImportDialogComponent } from './growth-import-dialog/growth-import-dialog.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(growthRoutes),
    SharedModule
  ],
  declarations: [
    GrowthPropertyComponent,
    GrowthComponent,
    GrowthImportDialogComponent,
    GrowthChartComponent,
  ],
  providers: [
    GrowthService,
    CropService,
    { provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY, useFactory: (overlay: Overlay) => { return () => overlay.scrollStrategies.close(); }, deps: [Overlay]}
  ]
})
export class GrowthModule { }
