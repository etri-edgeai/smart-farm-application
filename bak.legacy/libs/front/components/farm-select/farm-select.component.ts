import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { FarmService, UserService } from "@front/services";
import { DongDto, FarmDto } from "@libs/models";

/**
 * 
 */
@Component({
  selector: 'farm-select',
  templateUrl: './farm-select.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FarmSelectComponent {
  @Input() role?: string;
  @Input() multiple?: boolean = false;
  @Input() mainOnly?: boolean = false;
  @Input() allFarms: FarmDto[];
  @Input() userFarms: FarmDto[];
  @Input() sharedFarms: FarmDto[];
  @Output() selectionChange = new EventEmitter<DongDto[]>();

  @ViewChild('select') select: MatSelect;
  selectedFarms = new FormControl<DongDto[]>(null);

  constructor(private _farmService: FarmService, private _userService: UserService) { }

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

  onChange(e) {
    this.selectionChange.emit(this.selectedFarms.value);
    console.log('onChange', this.selectedFarms.value);
  }

  /*
  onChangeValue(e) {
    this.selectionChange.emit(this.selectedFarms.value);
    console.log('onChangeValue', e);
  }
  */
}