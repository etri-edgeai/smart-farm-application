import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { homeRoutes } from './home.routes';
import { MaterialModule } from '@front/material/material.module';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { HomeComponent } from './home.component';
import { ConfirmationModule } from '@front/services/confirmation';

@NgModule({
  imports: [
    HttpClientModule,
    HttpClientJsonpModule,
    CommonModule,
    RouterModule.forChild(homeRoutes),
    ConfirmationModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [
    HomeComponent
  ],
  providers: []
})
export class HomeModule { }
