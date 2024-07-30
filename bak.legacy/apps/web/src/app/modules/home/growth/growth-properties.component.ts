import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { CropService, GrowthService } from "@front";
import { ConfirmationService } from "@front/services/confirmation";
import { CropDto, GrowthPropertyDto } from "@libs/models";
import { forkJoin } from "rxjs";

@Component({
  selector: 'growth-properties',
  templateUrl: './growth-properties.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrowthPropertyComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  tableColumns: string[];

  crops: CropDto[];
  growthProperties: GrowthPropertyDto[];
  PROP_HEADER = '항목';

  constructor(
    private _growthService: GrowthService,
    private _cropService: CropService,
    //private apiService: ApiService,
    private _confirmationService: ConfirmationService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let data = [];

    forkJoin([
      this._cropService.getCrops(),
      this._growthService.getProperties()
    ]).subscribe(([crops, gp]) => {
      this.crops = crops;
      this.tableColumns = [this.PROP_HEADER];
      for (let c of crops) {
        this.tableColumns.push(c.name);
      }

      for (let p of gp) {
        const row = {
          name: p.name,
          code: p.code,
          unit: p.unit
        }

        for (let c of crops) {
          row[c.name] = p.crops?.includes(c.idx);
        }

        data.push(row);
      }

      this.dataSource.data = data;
    });

  }

  save() {
    const _data = this.dataSource.data;
    const data = [];

    for (let r of _data) {
      const crops = [];
      for (let crop of this.crops) {
        if (r[crop.name]) {
          crops.push(crop.idx);
        }
      }

      data.push({
        code: r.code,
        crops: crops
      })
    }

    this._growthService.saveProperties(data).subscribe({
      next: (res) => {
        const confirmation = this._confirmationService.open({
          title: '성공',
          icon: {color: 'success'},
          message: `생육항목을 저장하였습니다`,
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
      }
    });
  }

  trackByFn(index: number, item: any): any
  {
      return item.name;
  }
}
