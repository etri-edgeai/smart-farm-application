import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FrontFullscreenComponent } from '@front/components/fullscreen/fullscreen.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [FrontFullscreenComponent],
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, CommonModule],
  exports: [FrontFullscreenComponent],
})
export class FrontFullscreenModule {}
