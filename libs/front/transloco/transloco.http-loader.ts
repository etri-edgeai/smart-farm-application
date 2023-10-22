import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, map } from 'rxjs';
import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { FrontConfigService } from '@front/services/config';

@Injectable({
  providedIn: 'root',
})
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private _httpClient: HttpClient, private _config: FrontConfigService) {}

  getTranslation(lang: string): Observable<Translation> {
    let appName = this._config.config.name.toLowerCase();
    return forkJoin([
          this._httpClient.get<Translation>(`/files/i18n/${lang}.json`), // 공통
          this._httpClient.get<Translation>(`/files/i18n/${appName}/${lang}.json`) // 해당앱
    ]).pipe(
      map(([t1, t2]) => {return {...t1, ...t2}})
    );
  }

  getCommon(lang: string) {
  }

  getModuleTranslation(lang: string, module: string) {
  }
}
