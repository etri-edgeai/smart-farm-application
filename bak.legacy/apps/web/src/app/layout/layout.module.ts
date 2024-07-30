import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout.component';
import { EmptyLayoutModule } from './layouts/empty/empty.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebLayoutModule } from './layouts/web/web.module';

const layoutModules = [EmptyLayoutModule, WebLayoutModule];

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...layoutModules],
  exports: [LayoutComponent, ...layoutModules],
})
export class LayoutModule {}
