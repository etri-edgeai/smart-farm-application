import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: 'growth-edit',
  templateUrl: './growth-edit.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrowthEditComponent implements OnInit {
  ngOnInit(): void {
  }
}