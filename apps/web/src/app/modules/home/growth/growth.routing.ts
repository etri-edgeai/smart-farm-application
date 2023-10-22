import { Route } from '@angular/router';
import { GrowthPropertyComponent } from './growth-properties.component';
import { GrowthComponent } from './growth.component';

export const growthRoutes: Route[] = [
  { path: '', component: GrowthComponent },
  { path: 'properties', component: GrowthPropertyComponent },
];
