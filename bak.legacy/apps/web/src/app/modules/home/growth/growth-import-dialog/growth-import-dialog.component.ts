import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: 'growth',
  templateUrl: './growth-import-dialog.component.html',
  //styleUrls: ['./growth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrowthImportDialogComponent {
}
