import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { DateUtils } from '@libs/utils';

@Component({
  selector: 'date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangePickerComponent {
  @Input() role?: string;
  @Output() dateChange = new EventEmitter();

  dateRangeGroup = ['today', 'yesterday', 'threeDays', 'oneWeek', 'oneMonth', 'select'];

  searchRange = new FormGroup({
    start: new FormControl(DateUtils.add(new Date(), -2, 'd').toDate()),
    end: new FormControl(new Date()),
  });

  constructor() {
    this.searchRange.valueChanges.subscribe(dates => {
      this.dateChange.emit(dates);
    })
  }

  onTimeGroupChange(range) {
    let start =  new Date();
    let end = new Date();

    switch (range) {
      case 'today':
        break;
      case 'yesterday':
        start = DateUtils.add(new Date(), -1).toDate();
        end = DateUtils.add(new Date(), -1).toDate();
        break;
      case 'threeDays':
        start = DateUtils.add(new Date(), -2).toDate();
        break;
      case 'oneWeek':
        start = DateUtils.add(new Date(), -6).toDate();
        break;
      case 'oneMonth':
        start = DateUtils.add(DateUtils.add(new Date(), -1, 'M'), 1).toDate();
        break;
      case 'select':
        return;
    }

    this.searchRange.patchValue({start, end});
  }
}
