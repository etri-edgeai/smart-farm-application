import { Route } from '@angular/router';
import { AuthGuard } from '@front/auth/guards/auth.guard';
import { NoAuthGuard } from '@front/auth/guards/noAuth.guard';
import { LayoutComponent } from './layout/layout.component';

export const appRoutes: Route[] = [
  // Redirect empty path to '/admin'
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'home' },
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      { path: 'confirmation-required', loadChildren: () => import('./modules/auth/confirmation-required/confirmation-required.module').then((m) => m.AuthConfirmationRequiredModule), },
      { path: 'forgot-password', loadChildren: () => import('./modules/auth/forgot-password/forgot-password.module').then((m) => m.AuthForgotPasswordModule) },
      { path: 'reset-password', loadChildren: () => import('./modules/auth/reset-password/reset-password.module').then((m) => m.AuthResetPasswordModule) },
      { path: 'sign-in', loadChildren: () => import('./modules/auth/sign-in/sign-in.module').then((m) => m.AuthSignInModule) },
      { path: 'sign-up', loadChildren: () => import('./modules/auth/sign-up/sign-up.module').then((m) => m.AuthSignUpModule) },
    ],
  },

  // Landing routes
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: { layout: 'web' },
    children: [
      { path: 'home', loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule) },
    ],
  },
];
