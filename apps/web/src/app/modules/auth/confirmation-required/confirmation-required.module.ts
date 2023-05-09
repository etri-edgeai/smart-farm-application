import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthConfirmationRequiredComponent } from './confirmation-required.component';
import { authConfirmationRequiredRoutes } from './confirmation-required.routing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuthConfirmationRequiredComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(authConfirmationRequiredRoutes),
    MatButtonModule,
  ],
})
export class AuthConfirmationRequiredModule {}
