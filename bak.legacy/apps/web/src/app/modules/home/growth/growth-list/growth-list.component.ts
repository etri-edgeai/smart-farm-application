import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDrawer, MatDrawerMode } from "@angular/material/sidenav";
import { MatTableDataSource } from '@angular/material/table';
import { ApiService, CropService, FarmService, GrowthService, MentoringService, UserService } from "@front";
import { ConfirmationService } from "@front/services/confirmation";
import { GrowthProperty } from "@libs/db";
import { CropDto, CroppingSeasonDto, FarmDto, GrowthDto, GrowthPropertyDto } from "@libs/models";
import { BehaviorSubject, forkJoin, lastValueFrom, Observable, Subject } from "rxjs";

@Component({
  selector: 'growth-list',
  templateUrl: './growth-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrowthListComponent implements OnInit {
  grDataSource: MatTableDataSource<any> = new MatTableDataSource();
  grTableColumns: string[] = ['sampleId'];

  selectedCroppingSeason: CroppingSeasonDto;
  growthProperties: GrowthPropertyDto[];

  constructor(
    private _apiService: ApiService,
    private _userService: UserService,
    private _farmService: FarmService,
    private _growthService: GrowthService,
    private _cropService: CropService,
    //private apiService: ApiService,
    private _confirmationService: ConfirmationService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
  }
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
}