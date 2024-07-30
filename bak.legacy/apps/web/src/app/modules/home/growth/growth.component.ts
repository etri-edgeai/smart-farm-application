import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService, CropService, FarmService, GrowthService, UserService } from '@front';
import { ConfirmationService } from '@front/services/confirmation';
import { CroppingSeasonDto, GrowthDto, GrowthPropertyDto, Role } from '@libs/models';
import { DateUtils, StringUtils } from '@libs/utils';
import { map, Observable, startWith } from 'rxjs';
import { GrowthImportDialogComponent } from './growth-import-dialog/growth-import-dialog.component';

class GrowthEx extends GrowthDto {
  tableIdx?: number;
  mode: 'c' | 'm' | 'n' = 'n'; // create, modify, none
  _invDtMoment?: moment.Moment; // datepicker에서 moment adapter를 쓰고 있어서 사용.
  // invDt를 그냥 date나 isostring으로 사용할 경우 mysql date에 날짜 문제가 생긴다
}

@Component({
  selector: 'growth',
  templateUrl: './growth.component.html',
  styleUrls: ['./growth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrowthComponent implements OnInit, AfterViewInit {
  @ViewChild('csTableSort') csSort: MatSort;
  @ViewChild('grTableSort') grSort: MatSort;
  csDataSource = new MatTableDataSource<CroppingSeasonDto>();
  grDataSource = new MatTableDataSource<GrowthEx>();
  csTableColumns = ['farmName', 'name', 'cropBreedName', 'startDt', 'pinchDt', 'endDt', 'lastInvDt']; // 작기 테이블
  grTableColumns = ['select', 'sampleId', 'invDt', 'week']; // 생육수확 테이블
  sampleIdOptions: Observable<string[]>;

  myControl = new FormControl('');

  /** 리스트에서 클릭하여 선택한 cs */
  selectedCroppingSeason: CroppingSeasonDto;
  /** 전체 생육 항목들 */
  growthProperties: GrowthPropertyDto[];
  /** 선택한 작기 작물의 생육 항목들 */
  selectedCsGrowthProperty: GrowthPropertyDto[] = [];
  /** 선택한 작기의 unique 샘플id들 */
  selectedCsSampleIds: string[];
  /** 선택한 growthes */
  selectedGrowthes = new SelectionModel<GrowthEx>(true, []);

  constructor(
    private _apiService: ApiService,
    private _userService: UserService,
    private _farmService: FarmService,
    private _growthService: GrowthService,
    private _cropService: CropService,
    //private apiService: ApiService,
    private _confirmationService: ConfirmationService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialog: MatDialog
  ) {
    this.csDataSource.filterPredicate = (d, f) => {
      const spreadedFilter = StringUtils.spreadKorean(f);
      return (
        StringUtils.spreadKorean(d.name).includes(spreadedFilter) || StringUtils.spreadKorean(d.farm.name).includes(spreadedFilter)
      );
    };

    if (this._userService.user.role == Role.USER) {
      this._farmService.getFarmList(this._userService.user.role, this._userService.user.idx, true).subscribe((res:any) => {
        const userFarms = res.userFarms;
        //const sharedFarms = res.sharedFarms;
        this._farmService.getCroppingSeasonsAndGrowthInvDt(userFarms.map(f => f.idx)).subscribe((res) => this.csDataSource.data = res);
      });
    } else {
      this._farmService.getCroppingSeasonsAndGrowthInvDt().subscribe((res) => (this.csDataSource.data = res));
    }

    this._growthService.getProperties().subscribe((res) => {
      this.growthProperties = res;
    });

    this.sampleIdOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this.selectedCsSampleIds.filter((id) => id.toLocaleLowerCase().includes(value));
      })
    );
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.csDataSource.sort = this.csSort;
    this.grDataSource.sort = this.grSort;
  }

  get viewGrColumns() {
    const a = [...this.grTableColumns, ...this.selectedCsGrowthProperty.map((gp) => gp.code)];
    return a;
  }

  /**
   * growth가 현재 edit mode인지 여부
   * @param growth
   * @returns
   */
  isEdit(growth: GrowthEx) {
    return growth.mode == 'c' || growth.mode == 'm';
  }

  /**
   * 현재 edit mode인 growth가 있는지
   */
  get isEditing() {
    return this.grDataSource.data.find((gr) => this.isEdit(gr)) != null;
  }

  /**
   * 수정 버튼 활성화 여부
   */
  get editable() {
    return this.selectedGrowthes.selected.find((gr) => !this.isEdit(gr)) != null;
  }

  setSelectedCsSampleIds() {
    this.selectedCsSampleIds = Array.from(new Set(this.grDataSource.data.map((gr) => gr.sampleId))).sort((a, b) =>
      a.localeCompare(b)
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selectedGrowthes.selected.length;
    const numRows = this.grDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selectedGrowthes.clear();
      return;
    }

    this.selectedGrowthes.select(...this.grDataSource.data);
  }

  trackByFn(index: number, item: any): any {
    return item.name;
  }

  trackByFnGr(index: number, item: any): any {
    return item.idx;
  }

  csFilter(event) {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.csDataSource.filter = searchQuery?.trim();
  }

  onChange(e) {
    console.log(e);
  }

  onClickCs(row) {
    this.selectedCroppingSeason = row;
    const cropIdx = row.cropIdx;
    this._growthService.getGrowth(row.idx).subscribe((res) => {
      this.grDataSource.data = res as GrowthEx[];
      this.grDataSource.data.forEach((gr) => (gr._invDtMoment = DateUtils.toMoment(gr.invDt)));
      this.setSelectedCsSampleIds();
      this._changeDetectorRef.markForCheck();
    });

    if (this.growthProperties) {
      this.selectedCsGrowthProperty = this.growthProperties.filter((gp) => gp.crops.includes(cropIdx));
    } else {
      this.selectedCsGrowthProperty = [];
    }
  }

  onSortChange(e) {
    console.log(e);
    const order = e.direction == 'asc' ? 1 : -1;
    switch (e.active) {
      case 'farmName': this.csDataSource.data.sort((a, b) => a.farm.name.localeCompare(b.farm.name) * order); break;
      case 'cropBreedName': this.csDataSource.data.sort((a, b) => (a.cropName+a.breedName).localeCompare(b.cropName+b.breedName) * order); break;
    }
  }

  importGrowth() {
    // Open the dialog
    this._matDialog
      .open(GrowthImportDialogComponent, {
        autoFocus: false,
        data: null,
        panelClass: '',
      })
      .afterClosed()
      .subscribe((text) => {
        const growthes = this.parseGrowthText(text);
        const gr = this.grDataSource.data;
        gr.unshift(...growthes);
        this.grDataSource.data = gr;
      });
  }

  parseGrowthText(text: string) {
    const data: any[] = [];
    const headerMap = {};

    const lines = text.split(/\r?\n/);

    // 우선 2-d array로 만든다
    let lineIdx = 0;
    for (const line of lines) {
      const cols = line.split('\t').map(col => col.trim());

      // 헤더 처리
      let colIdx = 0;
      if (lineIdx == 0) {
        for (const col of cols) {
          headerMap[col] = colIdx;
          colIdx++;
        }
        lineIdx++;
        continue;
      }

      if (cols.length < 2 || (cols[1] != null && isNaN(+cols[1]))) {
        // 제대로된 조사값이 아니면 건너뜀. 부여에선 2라인이 단위.
        continue;
      }
      data.push(cols);
    }

    let growthes: GrowthEx[] = [];
    for (let i = 0; i < data.length; i++) {
      const growth = new GrowthEx();
      growth.sampleId = data[i][0];
      growth.idx = null;
      growth.farmIdx = this.selectedCroppingSeason.farmIdx,
      growth.mode = 'c';
      growthes.push(growth);
    }

    for (const gp of this.selectedCsGrowthProperty) {
      let idx;
      for (const header of Object.keys(headerMap)) {
        if (gp.name == header || gp.alias.includes(header)) {
          idx = headerMap[header];
          break;
        }
      }

      if (idx) {
        for (let i = 0; i < data.length; i++) {
          growthes[i][gp.code] = data[i][idx] == '' || isNaN(+data[i][idx]) ? null : +data[i][idx];
        }
      }
    }

    return growthes;
  }

  createGrowth() {
    const newData: GrowthEx = {
      idx: null,
      farmIdx: this.selectedCroppingSeason.farmIdx,
      cropIdx: this.selectedCroppingSeason.cropIdx,
      breedIdx: this.selectedCroppingSeason.breedIdx,
      mode: 'c',
    };

    const gr = this.grDataSource.data;
    gr.unshift(newData);
    this.grDataSource.data = gr;
  }

  edit() {
    this.selectedGrowthes.selected.forEach((gr) => {
      if (gr.mode != 'c') gr.mode = 'm';
    });

    this.selectedGrowthes.clear();
  }

  save() {
    const candidates = this.grDataSource.data
      .filter((gr) => this.isEdit(gr))
      .map((obj) => {
        return { ...obj };
      }); // deep copy
    candidates.forEach((gr) => {
      gr.csIdx = this.selectedCroppingSeason.idx;
      gr.cropIdx = this.selectedCroppingSeason.cropIdx;
      gr.breedIdx = this.selectedCroppingSeason.breedIdx;
      gr.invDt = DateUtils.toDateString(gr._invDtMoment);

      // 조사항목은 string을 number로 변환해서 보낸다
      for (let key of Object.keys(gr)) {
        if (!['invDt', 'sampleId'].includes(key) ) {
          gr[key] = gr[key] == '' || gr[key] == null || isNaN(+gr[key]) ? null : +gr[key];
        }
      }
    });
    this._changeDetectorRef.detectChanges();
    this._apiService.req('growth/save', candidates).subscribe({
      next: (res) => {
        // 결과 업데이트
        res.forEach((r) => {
          const updatedGr = this.grDataSource.data.find(
            (gr) => gr.sampleId == r.sampleId && DateUtils.toDateString(gr.invDt) == DateUtils.toDateString(r.invDt)
          );
          if (updatedGr) {
            updatedGr.idx = r.idx;
            updatedGr.mode = 'n';
          }
        });

        this.updateCsLastInvDt();
        this._changeDetectorRef.markForCheck();

        const confirmation = this._confirmationService.open({
          title: '성공',
          icon: {color: 'success'},
          message: `${candidates.length}개의 조사를 저장하였습니다`,
          actions: { confirm: { label: '확인', color: 'primary' }, cancel: { show: false } },
        });

        confirmation.afterClosed().subscribe((data) => {});
      },
      error: (res) => {
        const confirmation = this._confirmationService.open({
          title: '저장 작업 중 오류가 발생했습니다',
          message: res.error.message,
          actions: { confirm: { label: '확인' }, cancel: { show: false } },
        });

        confirmation.afterClosed().subscribe((data) => {});
      },
    });
  }

  delete() {
    const confirmation = this._confirmationService.open({
      title: 'Delete growth investigation',
      message: 'Are you sure you want to remove this growth investigation? This action cannot be undone!',
      actions: { confirm: { label: 'Delete' } },
    });

    confirmation.afterClosed().subscribe((data) => {
      if (data != 'confirmed') return;

      // create인 것은 단순 제거
      this.grDataSource.data = this.grDataSource.data.filter((gr) => {
        const needDelte = gr.mode == 'c' && this.selectedGrowthes.selected.includes(gr);
        if (needDelte) this.selectedGrowthes.toggle(gr);
        return !needDelte;
      });
      this._changeDetectorRef.markForCheck();

      // modify인 것은 서버로 전송
      const candidates = this.selectedGrowthes.selected.filter((gr) => gr.mode != 'c');
      if (!candidates || candidates.length == 0) return;

      const idxes = candidates.map((gr) => gr.idx);
      this._apiService.req('growth/delete', idxes).subscribe({
        next: (res) => {
          this.grDataSource.data = this.grDataSource.data.filter((gr) => !this.selectedGrowthes.selected.includes(gr));
          this.updateCsLastInvDt();
          this.selectedGrowthes.clear();
          this._changeDetectorRef.markForCheck();

          this._confirmationService.open({
            title: '삭제완료',
            message: `${res.affected}건의 조사를 삭제하였습니다`,
            actions: { confirm: { label: '확인' }, cancel: { show: false } },
          });
        },
        error: (res) => {
          this._confirmationService.open({
            title: '삭제실패',
            message: res.error.message,
            actions: { confirm: { label: '확인' }, cancel: { show: false } },
          });
        },
      });
    });
  }

  onChangeInvDt(e, growth: GrowthEx) {
    growth.invDt = DateUtils.toDateString(growth._invDtMoment);
    growth.week = this.getWeek(growth._invDtMoment.toDate(), this.selectedCroppingSeason.startDt);
  }

  getWeek(currDate: Date, startDate: Date) {
    if (currDate && startDate) {
      const week = DateUtils.diff(currDate, startDate, 'w');
      return week + 1;
    }
    return null;
  }

  updateCsLastInvDt() {
    const max = Math.max(...this.grDataSource.data.map(gr => DateUtils.toMoment(gr.invDt).valueOf()));
    const lastDate = DateUtils.format(max, DateUtils.simpleDateFormat);
    this.selectedCroppingSeason.lastInvDt = lastDate;
  }
}
