import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PredictEnvComponent } from './components/predict-env/predict-env.component';
import { PredictPestComponent } from './components/predict-pest/predict-pest.component';
import { SensorComponent } from './components/sensor/sensor.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/sensor', pathMatch: 'full'},
  { path: 'sensor', component: SensorComponent },
  { path: 'predict-env', component: PredictEnvComponent },
  { path: 'predict-pest', component: PredictPestComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false, // <-- debugging purposes only
      }
    )
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }