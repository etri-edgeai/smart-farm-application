import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { AuthModule, FrontModule, HeaderInterceptor } from '@front';
import { FrontConfigModule, FrontConfigService } from '@front/services/config';
import { appConfig } from './config/app.config';
import { LayoutModule } from './layout/layout.module';
import { IconsModule } from './icons/icons.module';
import { Observable } from 'rxjs';
import { NavigationService } from './services/navigation/navigation.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: 'enabled',
};

// 사이트 정보, 세팅 등을 가져 온다
function initialzeApp(config: FrontConfigService): () => Observable<any> {
  return () => config.getSiteConfig();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    FrontModule,
    FrontConfigModule.forRoot(appConfig),
    IconsModule,
    LayoutModule,
    AuthModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: initialzeApp, deps: [FrontConfigService], multi: true },
    NavigationService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
