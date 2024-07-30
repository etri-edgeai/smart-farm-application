import { Component, OnInit } from '@angular/core';
import { DeviceDto, SimpleDeviceDto } from '@libs/models/device';
import { PestPredictRequestDto, PestPredictResultDto } from '@libs/models/ai';
import { Observable } from 'rxjs';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'predict-pest',
  templateUrl: './predict-pest.component.html',
  styleUrls: ['./predict-pest.component.scss'],
})
export class PredictPestComponent implements OnInit {
    devices$: Observable<DeviceDto[]>;
    selected: number;
    //chart: am5xy.XYChart;
    baseTime: string;
    pestPredictResult$: Observable<PestPredictResultDto>;
  
    constructor(private http: HttpService) {}
  
    ngOnInit() {
      const now = new Date();
      const offsetMs = now.getTimezoneOffset() * 60 * 1000;
      const dt = new Date(now.getTime() - offsetMs).toISOString().split('T');
      this.baseTime = dt[0] + ' ' + dt[1].substring(0, 5);
      this.devices$ = this.http.post<DeviceDto[]>('device/list');
    }
  
    ngAfterViewInit() {
      //this.prepareChart();
    }
  
    predict() {
      let data: PestPredictRequestDto = {
        deviceIdx: this.selected,
        baseTime: this.baseTime
      };
      this.pestPredictResult$ = this.http.post('ai/predict-pest', data);

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
  
}
