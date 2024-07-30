import { Route } from '@angular/router';
import { HomeComponent } from './home.component';

export const homeRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'growth', loadChildren: () => import('./growth/growth.module').then(m => m.GrowthModule) }
];
