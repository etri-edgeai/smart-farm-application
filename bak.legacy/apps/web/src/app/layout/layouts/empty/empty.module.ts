import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
//import { FuseLoadingBarModule } from '@front/components/loading-bar';
//import { SharedModule } from 'app/shared/shared.module';
import { EmptyLayoutComponent } from './empty.component';

@NgModule({
  declarations: [EmptyLayoutComponent],
  imports: [
    RouterModule,
    CommonModule,
    //FuseLoadingBarModule,
    //SharedModule
  ],
  exports: [EmptyLayoutComponent],
})
export class EmptyLayoutModule {}
