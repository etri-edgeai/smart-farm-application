import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { InternalDto } from '@libs/models/sensor';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

@Component({
  selector: 'sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.scss'],
})
export class SensorComponent implements OnInit {
  displayedColumns: string[] = ['sensingTime', 'temp', 'humidity', 'co2'];
  dataSource = new MatTableDataSource();

  constructor(private http: HttpService) {}

  ngOnInit() {
    this.http.get<InternalDto[]>("getInternal", {key: 'value'})
      .subscribe(data => {
        this.dataSource.data = data;
      });
  }
}
