import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FrontFullscreenModule } from '@front/components/fullscreen';
import { FuseNavigationModule } from '@front/components/navigation';
import { WebLayoutComponent } from './web.component';
import { LanguagesModule } from '../../languages/languages.module';
import { SharedModule } from '../../../modules/shared/shared.module';
import { TranslocoCoreModule } from '@front/transloco/transloco.module';

@NgModule({
  declarations: [WebLayoutComponent],
  imports: [
    HttpClientModule,
    HttpClientJsonpModule,
    RouterModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    FrontFullscreenModule,
    TranslocoCoreModule,
    FuseNavigationModule,
    LanguagesModule,
    SharedModule
  ],
  exports: [WebLayoutComponent],
})
export class WebLayoutModule {}
