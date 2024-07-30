import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatSelect } from "@angular/material/select";
import { FarmService, UserService } from "@front/services";
import { DongDto, FarmDto } from "@libs/models";

/**
 *
 */
@Component({
  selector: 'farm-dong-select',
  templateUrl: './farm-dong-select.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FarmDongSelectComponent {
  @Input() role?: string;
  @Input() multiple?: boolean = false;
  @Input() mainOnly?: boolean = false;
  @Input() allFarms: FarmDto[];
  @Input() userFarms: FarmDto[];
  @Input() sharedFarms: FarmDto[];
  @Input() selectedDongs: number[];
  @Output() selectedDongsChange =  new EventEmitter<number[]>();

  // TODO: envcomponent에서 쓰던거라 이렇게 emit하긴 하는데, index만 보내도록 바꿀 필요가 있다
  @Output() selectionChange = new EventEmitter<{farm: FarmDto, dong: DongDto}[]>();

  @ViewChild('select') select: MatSelect;

  constructor(private _farmService: FarmService, private _userService: UserService, private _cdf: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.selectedDongs && !this.allFarms && this.userFarms && this.userFarms.length > 0 && this.userFarms[0].dongs?.length > 0) {
      this.selectedDongs = [this.userFarms[0].dongs[0].idx];
      this.onChange(this.selectedDongs);
    }

    if (!this.selectedDongs && this.sharedFarms && this.sharedFarms.length > 0 && this.sharedFarms[0].dongs?.length > 0) {
        this.selectedDongs = [this.sharedFarms[0].dongs[0].idx];
        this.onChange(this.selectedDongs);
    }
  }

  /*
  ngOnChanges(changes: SimpleChanges) {
    const mainOnly = changes.mainOnly.currentValue;
    const selected = this.select.options.toArray().filter(o => {
      return o.selected && !(mainOnly && !o.value.main);
    }).map<FarmDongDto>(o => o.value);

    console.log('ngOnChanges', selected)
    //this.select.selectionChange.emit(selected);

    this.select.valueChange.emit(selected);
  }
  */

  /**
   *
   * @param e 동 idx
   */
  onChange(e: number | number[]) {
    const selectedDongs = Array.isArray(e)? e: [e];

    this.selectedDongsChange.emit(selectedDongs);

    const selections = [];

    this.allFarms?.forEach(f => {
      f.dongs.forEach(d => {
        if (selectedDongs.includes(d.idx)) {
          selections.push({farm: f, dong: d});
        }
      })
    });

    this.userFarms?.forEach(f => {
      f.dongs.forEach(d => {
        if (selectedDongs.includes(d.idx)) {
          selections.push({farm: f, dong: d});
        }
      })
    });

    this.sharedFarms?.forEach(f => {
      f.dongs.forEach(d => {
        if (selectedDongs.includes(d.idx)) {
          selections.push({farm: f, dong: d});
        }
      })
    });

    this.selectionChange.emit(selections);
  }

  /*
  onChangeValue(e) {
    this.selectionChange.emit(this.selectedFarms.value);
    console.log('onChangeValue', e);
  }
  */
}
