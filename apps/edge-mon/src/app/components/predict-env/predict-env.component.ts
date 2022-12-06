import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http.service';
// import { PredictInternalSelfDto } from '@libs/models/sensor';
import { DeviceDto, SimpleDeviceDto } from '@libs/models/device';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import { Observable } from 'rxjs';

@Component({
  selector: 'predict-env',
  templateUrl: './predict-env.component.html',
  styleUrls: ['./predict-env.component.scss'],
})
export class PredictEnvComponent implements OnInit, AfterViewInit {
  devices$: Observable<DeviceDto[]>;
  selected: number;
  chart: am5xy.XYChart;
  baseTime: string;

  constructor(private zone: NgZone, private http: HttpService) {}

  ngOnInit() {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    const dt = new Date(now.getTime() - offsetMs).toISOString().split('T');
    this.baseTime = dt[0] + ' ' + dt[1].substring(0, 5);
    this.devices$ = this.http.post<DeviceDto[]>('device/list');
    /*
    this.http.get<SimpleDeviceDto[]>('getSimpleDeviceList').subscribe((devices) => {
      this.devices = devices;
      if (devices?.length > 0) {
        this.selected = devices[0].id;
      }
    });
    */
  }

  ngAfterViewInit() {
    this.prepareChart();
  }

  predict() {
    /* temporarily comment out
    this.http
      .get<PredictInternalSelfDto>('ml.serving', { model: 'InternalSelf', deviceId: this.selected, baseTime: this.baseTime })
      .subscribe(
        (res) => {
          if (res.input.length == 0) {
            alert('No data');
            return;
          }
          const dataInput: any[] = [];
          for (let i = 0; i < res.input.length; i++) {
            const date = new Date(String(res.input[i][0]));
            dataInput.push({
              date: date.getTime(),
              value: res.input[i][1],
            });
          }

          const dataPredict: any[] = [];
          let date = new Date(String(res.input[res.input.length - 1][0]));
          for (let i = 0; i < res.pred.length; i++) {
            am5.time.add(date, 'minute', 10);
            dataPredict.push({
              date: date.getTime(),
              value: Math.round(res.pred[i] * 10) / 10,
            });
          }

          this.chart.series.getIndex(0)!.data.setAll(dataInput);
          this.chart.series.getIndex(1)!.data.setAll(dataPredict);
        },
        (e) => {
          alert(e);
        }
      );
      */
  }

  prepareChart() {
    let root = am5.Root.new('chartdiv');
    root.setThemes([am5themes_Animated.new(root)]);

    this.chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
      })
    );

    let cursor = this.chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'none',
      })
    );
    cursor.lineY.set('visible', false);

    let xAxis = this.chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.5,
        baseInterval: {
          timeUnit: 'minute',
          count: 10,
        },
        gridIntervals: [
          { timeUnit: 'minute', count: 10 },
          { timeUnit: 'minute', count: 30 },
          { timeUnit: 'hour', count: 1 },
          { timeUnit: 'hour', count: 3 },
          { timeUnit: 'hour', count: 6 },
          { timeUnit: 'hour', count: 12 },
        ],
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    let yAxis = this.chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    const colorSet = am5.ColorSet.new(root, {});

    let seriesInput = this.chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'SeriesInput',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        valueXField: 'date',
        stroke: colorSet.getIndex(0),
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY}',
        }),
      })
    );

    let seriesPredict = this.chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'SeriesPredict',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        valueXField: 'date',
        stroke: colorSet.getIndex(6),
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY}',
        }),
      })
    );

    this.chart.set(
      'scrollbarX',
      am5.Scrollbar.new(root, {
        orientation: 'horizontal',
      })
    );

    seriesInput.appear(100);
    this.chart.appear(100, 10);
  }
}
