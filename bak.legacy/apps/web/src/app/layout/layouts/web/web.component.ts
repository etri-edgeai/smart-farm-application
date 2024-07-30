import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FrontMediaWatcherService } from '@front/services/media-watcher';
import { FuseVerticalNavigationComponent } from '@front/components/navigation/vertical/vertical.component';
import { FuseNavigationService } from '@front/components/navigation/navigation.service';
import { Navigation } from '../../../services/navigation/navigation.types';
import { NavigationService } from '../../../services/navigation/navigation.service';
import { UserService } from '@front/services/user.service';
import { AppConfig, Scheme } from '../../../config/app.config';
import { FrontConfigService } from '@front/services/config';
import { Role } from '@libs/models';
import { AuthService } from '@front';
import { registerPlugin } from '@capacitor/core';

export interface DetectDiseasePlugin {
  launch(options: { value: string }): Promise<{ value: string }>;
}

@Component({
  selector: 'web-layout',
  templateUrl: './web.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class WebLayoutComponent implements OnInit, OnDestroy {
  isScreenSmall: boolean;
  navigation: Navigation;
  _unsubscribeAll: Subject<any> = new Subject<any>();
  config: AppConfig;
  isSuperAdmin = false;

  detectDiseasePlugin: DetectDiseasePlugin;
  value;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _navigationService: NavigationService,
    private _fuseMediaWatcherService: FrontMediaWatcherService,
    private _fuseNavigationService: FuseNavigationService,
    private _userService: UserService,
    private _configService: FrontConfigService,
    private _authService: AuthService
  ) {
    // this.subUser = this._userService.user$.subscribe(user => this.user = user);
    // this.user = this._userService.user;
    this.detectDiseasePlugin = registerPlugin<DetectDiseasePlugin>('DetectDisease');
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  get user() {
    return this._userService.user;
  }

  ngOnInit(): void {
    this._userService.user$.subscribe(user =>
      this.isSuperAdmin = user && user.role == Role.SUPER_ADMIN
    );

    this._configService.config = { name: 'Admin', title: 'hmm' };

    // Subscribe to config changes
    this._configService.config$.pipe(takeUntil(this._unsubscribeAll)).subscribe((config: AppConfig) => {
      // Store the config
      this.config = config;
    });

    // Subscribe to navigation data
    this._navigationService.navigation$.pipe(takeUntil(this._unsubscribeAll)).subscribe((navigation: Navigation) => {
      this.navigation = navigation;
    });

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
      // Check if the screen is small
      console.log('matchingAliases: ', matchingAliases);
      this.isScreenSmall = !matchingAliases.includes('lg');
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  toggleNavigation(name: string): void {
    const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

    if (navigation) {
      navigation.toggle();
    }
  }

  signOut(): void {
    // this._router.navigate(['/sign-out']);

    this._authService.signOut();
    this._router.navigate(['sign-in']);
  }

  setScheme(scheme: Scheme): void {
    this._configService.config = { scheme };
  }

  async detectDisease() {
    this.value = JSON.stringify(await this.detectDiseasePlugin.launch({ value: 'Hello World!' }));
    console.log('Response from native:', this.value);
    console.log('');
  }

  goGrowth() {
    // this._router.navigate(['growth']);
    this._router.navigate(['/home/growth']);
  }
}
