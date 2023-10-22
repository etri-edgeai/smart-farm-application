import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationConfig } from '@front/services/confirmation/confirmation.types';

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './dialog.component.html',
  styles: [
    `
      .fuse-confirmation-dialog-panel {
        @apply md:w-128;

      }
      .fuse-confirmation-dialog-panel.mat-mdc-dialog-container.mat-mdc-dialog-surface {
            padding: 0 !important;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationConfig) {}
}
