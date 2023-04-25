import {
  Translation,
  TRANSLOCO_CONFIG,
  TRANSLOCO_LOADER,
  translocoConfig,
  TranslocoModule,
  TranslocoService,
} from '@ngneat/transloco';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { TranslocoHttpLoader } from './transloco.http-loader';
import { lastValueFrom } from 'rxjs';

@NgModule({
  providers: [
    {
      // Provide the default Transloco configuration
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: [
          { id: 'ko', label: 'Korean' },
          { id: 'en', label: 'English' },
          { id: 'tr', label: 'Turkish' },
        ],
        defaultLang: 'ko',
        fallbackLang: 'ko',
        reRenderOnLangChange: true,
        prodMode: true,
      }),
    },
    {
      // Provide the default Transloco loader
      provide: TRANSLOCO_LOADER,
      useClass: TranslocoHttpLoader,
    },
    {
      // Preload the default language before the app starts to prevent empty/jumping content
      provide: APP_INITIALIZER,
      deps: [TranslocoService],
      useFactory:
        (translocoService: TranslocoService): any =>
        (): Promise<Translation> => {
        // TODO: site-config의 값으로 설정해야 한다
          const defaultLang = translocoService.getDefaultLang();
          translocoService.setActiveLang(defaultLang);
          return lastValueFrom(translocoService.load(defaultLang));
        },
      multi: true,
    },
  ],
  exports: [TranslocoModule],
})
export class TranslocoCoreModule {}
