import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@front/animations';

@Component({
  selector: 'auth-confirmation-required',
  templateUrl: './confirmation-required.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AuthConfirmationRequiredComponent {
  constructor() {}
}
