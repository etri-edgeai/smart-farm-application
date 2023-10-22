import { Route } from '@angular/router';
import { AuthForgotPasswordComponent } from './forgot-password.component';

export const authForgotPasswordRoutes: Route[] = [
  {
    path: '',
    component: AuthForgotPasswordComponent,
  },
];
