import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { registerPlugin } from '@capacitor/core';
import { FrontConfigService } from '@front/services/config';

export interface DetectDiseasePlugin {
  launch(options: { value: string }): Promise<{ value: string }>;
}

@Component({
  selector: 'ros-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'web';
  siteCode: string;
  detectDiseasePlugin: DetectDiseasePlugin;
  value;

  constructor(
    @Inject(DOCUMENT) private _document: any,
    private _titleService: Title,
    private _configService: FrontConfigService
  ) {
    this._updateScheme();
    this._updateTheme();
    this.siteCode = this._configService.siteConfig.code;
    this._titleService.setTitle(this._configService.siteConfig.titleAdmin);
    this.detectDiseasePlugin = registerPlugin<DetectDiseasePlugin>('DetectDisease');
  }

  async ngOnInit() {
    console.log('ok');
  }

  ngAfterViewInit(): void {
    // this._document.getElementById('appFavicon').setAttribute('href', `/files/${this.siteCode}/images/favicon.ico`);
    console.log('ok');
  }

  private _updateScheme(): void {
    this._document.body.classList.remove('light', 'dark');
    this._document.body.classList.add('light');
    this._configService.config$.subscribe(config => {
    })
  }

  private _updateTheme(): void {
    this._document.body.classList.forEach((className: string) => {
      if (className.startsWith('theme-')) {
        this._document.body.classList.remove(className, className.split('-')[1]);
      }
    });

    this._document.body.classList.add('theme-default'); // default theme
  }

  async launch() {
    this.value = JSON.stringify(await this.detectDiseasePlugin.launch({ value: 'Hello World!' }));
    console.log('Response from native:', this.value);
    console.log('');
  }
}
