import { Route } from '@angular/router';
import { AuthConfirmationRequiredComponent } from './confirmation-required.component';

export const authConfirmationRequiredRoutes: Route[] = [
  {
    path: '',
    component: AuthConfirmationRequiredComponent,
  },
];
