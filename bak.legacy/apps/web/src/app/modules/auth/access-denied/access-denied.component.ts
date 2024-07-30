import { Component } from '@angular/core';
import { FrontConfigService } from '@front/services/config';

@Component({
  selector: 'access-denied',
  templateUrl: './access-denied.component.html',
})
export class AccessDeniedComponent {
  titleAdmin = '';
  constructor(private config: FrontConfigService) {
    this.titleAdmin = this.config.siteConfig.titleAdmin;
  }
 }
