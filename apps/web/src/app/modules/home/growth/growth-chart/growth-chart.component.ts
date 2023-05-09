import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, SimpleChange, ViewChild } from '@angular/core';
import { CroppingSeasonDto, GrowthDto, GrowthPropertyDto, PredictGrowthResponseDto } from '@libs/models';
import { AiService } from '@front/services/ai.service';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4bullets from '@amcharts/amcharts4/plugins/bullets';
import { DateUtils } from '@libs/utils';
import { FrontConfigService } from '@front/services/config';

@Component({
  selector: 'growth-chart',
  templateUrl: './growth-chart.component.html',
  styleUrls: ['./growth-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrowthChartComponent implements AfterViewInit, OnDestroy {
  @Input() growthProperties: GrowthPropertyDto[];
  @Input() croppingSeason: CroppingSeasonDto;
  @Input() growthes: GrowthDto[];
  // tabs 안에서는 amchart4의 create()에서 div id가 먹히질 않기 때문에 element의 reference로 create()한다
  @ViewChild('chart') chartElement: ElementRef<HTMLElement>;
  chart: am4charts.XYChart;
  series: { [key: string]: am4charts.Series } = {}; // key: growth property code
  yAxes: { [key: string]: am4charts.ValueAxis } = {};

  predicted: PredictGrowthResponseDto[];
  propertyChecked: { [key: string]: boolean } = {};
  selectableProperties: GrowthPropertyDto[] = [];

  vr: GrowthPropertyDto = {
    code: 'vr',
    name: '생장',
    unit: '',
  };
  vrdata = [];

  predictSub;

  constructor(
    private _aiService: AiService, //
    private _config: FrontConfigService,
    private _changeDetectorRef: ChangeDetectorRef
    ) {}

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChange) {
    if (changes['growthProperties']) {
      if (Object.keys(this.propertyChecked).length == 0) {
        // propertyChecked가 initialized가 안됐으면 만들어 넣는다
        this.growthProperties.forEach((gp) => (this.propertyChecked[gp.code] = false));
        this.propertyChecked['plantHeight'] = true;
      }
    }

    if (changes['growthes']) {
      // growthes가 바뀌었으므로 chart를 리셋한다
      if (!this.croppingSeason || !this.croppingSeason.idx) return;
      if (this.chart) this.chart.series.clear();

      const id = this.sampleIds && this.sampleIds.length > 0 ? this.sampleIds[0] : null;
      if(this.predictSub) {
        this.predictSub.unsubscribe();
        this.predictSub = null;
      }
      this.predictSub = this._aiService.predictGrowth(this.croppingSeason.idx).subscribe({
        next: (predicted) => {
          this.predicted = predicted;
          this.buildPredictChart(id);
        },
        complete: () => {
          this.predictSub.unsubscribe();
          this.predictSub = null;
        },
      });

      this.buildChartData(id);
      this.setYAxisDisabled();
      // this._changeDetectorRef.detectChanges();
    }
  }

  get siteConfig$() {
    return this._config.siteConfig$;
  }

  /**
   * unique sampleIds를 오름차순으로 반환
   */
  get sampleIds() {
    return [...new Set(this.growthes.map((g) => g.sampleId))].sort((a, b) => a.localeCompare(b));
  }

  initChart() {
    if ((this.chart && !this.chart.isDisposed()) || !this.chartElement) {
      return;
    }

    // am4core.unuseAllThemes();
    // am4core.options.minPolylineStep = 10;

    // XXX: 'Chart was not disposed' 로그가 찍히는데, matTabs 내부로 숨겨져서 어쩔 수 없는 것 같다
    this.chart = am4core.create(this.chartElement.nativeElement, am4charts.XYChart);
    // this.chart.dateFormatter.timezone = 'Asia/Seoul';
    //this.chart.dateFormatter.timezoneOffset = -1440 - 540;

    // this.chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm:ss";
    // this.chart.dateFormatter.utc = true
    this.chart.padding(25, 15, 15, 0);
    this.chart.preloader.disabled = true;

    let dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {
      timeUnit: 'day',
      count: 1,
    };
    // dateAxis.timezoneOffset = -570;
    dateAxis.dataFields.date = 'date';
    dateAxis.dateFormats.setKey('day', 'dd일');
    dateAxis.dateFormats.setKey('week', 'MM-dd');
    dateAxis.dateFormats.setKey('month', 'MM월');
    //dateAxis.periodChangeDateFormats.setKey("hour", "dd일 HH시");
    dateAxis.periodChangeDateFormats.setKey('month', 'YYYY년 MM월');
    dateAxis.tooltipDateFormat = 'MM월 dd일';
    dateAxis.tooltip.label.padding(5, 10, 5, 10);
    dateAxis.tooltip.label.fill = am4core.color('#fff');
    dateAxis.tooltip.background.fill = am4core.color('#000');
    dateAxis.tooltip.background.cornerRadius = 5;
    dateAxis.tooltip.background.fillOpacity = 0.8;
    //dateAxis.renderer.minGridDistance = 60;
    // dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.axisFills.template.disabled = true;
    dateAxis.renderer.ticks.template.disabled = true;
    dateAxis.renderer.line.strokeOpacity = 1;
    dateAxis.renderer.line.strokeWidth = 1;

    // Add scrollbar
    this.chart.scrollbarX = new am4core.Scrollbar();
    this.chart.scrollbarX.parent = this.chart.bottomAxesContainer;
    this.chart.cursor = new am4charts.XYCursor();
  }

  buildChartData(sampleId) {
    if (!this.chart) return;

    var seed = this.croppingSeason.idx;
    function random() {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    //const vrdata = [2, 2, 2, 3, 2, 1, 2, 3, 5, 6, 3, 4, 4, 6, 7, 8, 7, 5];

    this.vrdata = [];
    for (let i = 0; i < 40; i++) {
      let val =  i == 0 ? 8 : this.vrdata[i-1] - 0.4;
      let ran = random();
      val = val + (ran - 0.5) * 5;
      val = (i > 2 && (val - this.vrdata[i-2]) < -2) ? val + 1 : val;
      val = val < 1 ? 1 : val;
      val = val > 9 ? 9 : val;
      this.vrdata.push(val);
    }


    const chartDataMap = {};
    const seriesMap = {};
    this.chart.series.clear();
    this.chart.xAxes.getIndex(0).axisRanges.clear();

    // Object.values(this.yAxes).forEach((y) => (y.disabled = true));

    const growthes = this.growthes.filter((gr) => gr.sampleId == sampleId).sort((a, b) => DateUtils.toDate(a.invDt).getTime() - DateUtils.toDate(b.invDt).getTime());
    let j = 0;
    for (const gr of growthes) {
      let vrLength = 0;
      for (const gp of this.growthProperties) {
        let key = gp.code;
        const value = +gr[key];

        if (isNaN(value)) continue;

        let chartData = chartDataMap[key];
        if (!chartData) {
          chartDataMap[key] = chartData = [];
        }

        const a = DateUtils.toDateString(gr.invDt);
        // const dataObj = { date: DateUtils.toMoment(gr.invDt).utc(false).toDate(), value: gr[key] };
        const dataObj = { date: DateUtils.toDate(gr.invDt), value: gr[key] };
        chartData.push(dataObj);
        if (vrLength < chartData.length) vrLength = chartData.length;
      }


      // 영양 생식
      let key = 'vr';

      const dataObj = { date: DateUtils.toDate(gr.invDt), value: Math.floor(this.vrdata[j]) };
      let chartData = chartDataMap[key];
      if (!chartData) {
        chartDataMap[key] = chartData = [];
      }
      chartData.push(dataObj);
      j++;
    }

    // series 생성
    let i = 0;
    for (const gp of this.growthProperties) {
      const key = gp.code;
      // let unit = key == 'plantHeight' ? gp.unit + ' ' : gp.unit;
      let unit = gp.unit;
      unit = unit == '' ? ' ' : unit;

      const series = new am4charts.LineSeries();
      series.name = gp.code;
      series.stroke = this.chart.colors.getIndex(i);
      series.dataFields.valueY = 'value';
      series.dataFields.dateX = 'date';
      const bullets = series.bullets.push(new am4charts.CircleBullet());
      bullets.circle.radius = 3;
      bullets.stroke = series.stroke;
      bullets.fill = series.stroke;
      series.tooltip.background.cornerRadius = 3;
      series.tooltip.background.fillOpacity = 0.3;
      series.adapter.add('tooltipText', function (text, target) {
        let data = target.tooltipDataItem.dataContext;
        if (data != null) {
          let pString = '';
          if (data['isPredicted']) pString = '예측';
          let value = `${gp.name} ${pString}: ${data['value']}${unit}`;
          return value;
        }
        return '';
      });

      const data = chartDataMap[key];
      if (data && data.length > 0) {
        let valueAxis = this.yAxes[unit];
        if (!valueAxis) {
          valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
          valueAxis.disabled = true;
          //valueAxis.numberFormatter = new am4core.NumberFormatter();
          //valueAxis.numberFormatter.numberFormat = "#.0";
          // valueAxis.adjustLabelPrecision = false;
          valueAxis.fontSize = '0.8em';
          valueAxis.renderer.line.strokeOpacity = 1;
          valueAxis.renderer.line.strokeWidth = 1;
          valueAxis.renderer.ticks.template.disabled = true;
          valueAxis.renderer.grid.template.disabled = true;
          valueAxis.renderer.axisFills.template.disabled = true;
          // valueAxis.tooltip.disabled = true;
          // valueAxis.title.text = key == 'plantHeight' ? unit + ' ' : unit; // 초장은 길어서 따로 처리하려고
          valueAxis.title.text = unit;

          // series(growthProperty) 종류별 설정
          switch (key) {
            case 'plantHeight':
              valueAxis.renderer.opposite = false;
              valueAxis.title.dx = 36;
              break;
            default:
              valueAxis.renderer.opposite = true;
              valueAxis.title.rotation = 0;
              // valueAxis.title.dx = -30;
              valueAxis.title.dx = -20;
          }

          valueAxis.title.rotation = 0;
          valueAxis.title.dy = -110;

          this.yAxes[unit] = valueAxis;
          console.log('[' + unit + ']');
        }

        // series.data = chartDataMap[key];
        series.data = chartDataMap[key];
        series.disabled = !this.propertyChecked[series.name];
        series.yAxis = valueAxis;
        seriesMap[key] = series;
      }

      i++;
    }

    // 적심
    if (this.croppingSeason.pinchDt) {
      const flag = new am4bullets.FlagBullet();
      flag.label.text = '적심';
      flag.label.horizontalCenter = 'middle';
      flag.label.fontSize = 12;

      const color = am4core.color('#B38A58');

      flag.pole.stroke = color;
      flag.pole.strokeWidth = 2;
      flag.background.waveLength = 10;
      flag.background.fill = color;
      flag.background.stroke = color;
      flag.background.strokeWidth = 1;
      flag.background.fillOpacity = 0.6;

      const pinchEvent = this.chart.xAxes.getIndex(0).axisRanges.create() as am4charts.DateAxisDataItem;
      pinchEvent.date = new Date(this.croppingSeason.pinchDt);
      pinchEvent.bullet = flag;
      pinchEvent.grid.strokeWidth = 0;
    }

    // 영양 생식
    if (this._config.siteConfig.code == 'dm' || this._config.siteConfig.code == 'fcdm') {
      const vrtext = ['생식2단계', '생식2단계', '생식1단계', '생식1단계', '중간', '영양1단계', '영양1단계', '영양2단계', '영양2단계'];

      const key = 'vr';
      const unit = ' ';

      const series = new am4charts.LineSeries();
      series.name = 'vr';
      series.stroke = this.chart.colors.getIndex(this.growthProperties.length);
      series.dataFields.valueY = 'value';
      series.dataFields.dateX = 'date';
      const bullets = series.bullets.push(new am4charts.CircleBullet());
      bullets.circle.radius = 3;
      bullets.stroke = series.stroke;
      bullets.fill = series.stroke;
      series.tooltip.background.cornerRadius = 3;
      series.tooltip.background.fillOpacity = 0.3;
      series.adapter.add('tooltipText', function (text, target) {
        let data = target.tooltipDataItem.dataContext;
        if (data != null) {
          let pString = '';
          if (data['isPredicted']) pString = '예측';
          let value = `생장 ${pString}: ${vrtext[+data['value'] - 1]}`;
          return value;
        }
        return '';
      });

      const data = chartDataMap[key];
      if (data && data.length > 0) {
        let valueAxis = this.yAxes[unit];
        if (!valueAxis) {
          valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
          //valueAxis.numberFormatter = new am4core.NumberFormatter();
          //valueAxis.numberFormatter.numberFormat = "#.0";
          // valueAxis.adjustLabelPrecision = false;
          valueAxis.fontSize = '0.8em';
          valueAxis.renderer.opposite = true;
          valueAxis.renderer.line.strokeOpacity = 1;
          valueAxis.renderer.line.strokeWidth = 1;
          valueAxis.renderer.ticks.template.disabled = true;
          valueAxis.renderer.grid.template.disabled = true;
          valueAxis.renderer.axisFills.template.disabled = true;
          valueAxis.title.text = unit;
          // valueAxis.tooltip.disabled = true;
          this.yAxes[unit] = valueAxis;
        }
        valueAxis.disabled = true;
        series.yAxis = valueAxis;
        series.data = chartDataMap[key];
        series.disabled = !this.propertyChecked[series.name];

        seriesMap[key] = series;
      }
    }

    this.chart.series.pushAll(Object.values(seriesMap));
    this.series = seriesMap;

    const filtered = this.growthProperties.filter((gp) => Object.keys(this.series).includes(gp.code));
    // this.selectableProperties = [...filtered];
    this.selectableProperties = filtered;
    if (this._config.siteConfig.code == 'dm' || this._config.siteConfig.code == 'fcdm') {
      this.selectableProperties.push(this.vr);
    }

    this._changeDetectorRef.markForCheck();
  }

  /**
   * 예측데이터를 series에 추가
   * @param sampleId
   */
  buildPredictChart(sampleId) {
    let pred = null;

    if (this.predicted) {
      pred = this.predicted.find((p) => p.sampleId == sampleId);
    }

    const dateAxis = this.chart.xAxes.getIndex(0) as am4charts.DateAxis;
    let startDate;
    let endDate;

    // 예측구간 색칠을 지운다. 이미 있을땐 skip해도 될 것 같은데..
    dateAxis.axisRanges.each(r => {
      if (r.text == 'predictRange') dateAxis.axisRanges.removeValue(r);
    });

    const pinchDt = this.croppingSeason.pinchDt;

    for (const series of this.chart.series) {
      const key = series.name;
      //수확과중은 농정원과제 시연안함
      if (key == 'harvestWeight') continue;

      const gp = this.growthProperties.find((p) => p.code == key);
      if (!(pinchDt && gp && gp.afterPinchDisabled) && pred && pred[key]) {
        const dataObj = { date: DateUtils.from(pred['predictDate'], DateUtils.simpleDateFormat).toDate(), value: Math.round(pred[key]), isPredicted: true };
        // 이미 들어 가 있으면 건너뜀
        if (series.data[series.data.length - 1].isPredicted) continue;

        startDate = series.data[series.data.length - 1].date;
        endDate = dataObj.date;
        series.addData(dataObj);
        const seriesRange = dateAxis.createSeriesRange(series);
        seriesRange.contents.strokeDasharray = '2,3';
        seriesRange.contents.strokeWidth = 1;
        seriesRange.date = DateUtils.add(startDate, 1, 'd').toDate();
        seriesRange.endDate = DateUtils.add(endDate, 1, 'd').toDate();
      } else if (key == 'vr') {
        // 영양생식
        const dataObj = { date: DateUtils.from(pred['predictDate'], DateUtils.simpleDateFormat).toDate(), value: Math.floor(this.vrdata[series.data.length]), isPredicted: true };
        startDate = series.data[series.data.length - 1].date;
        endDate = dataObj.date;
        series.addData(dataObj);
        const seriesRange = dateAxis.createSeriesRange(series);
        seriesRange.contents.strokeDasharray = '2,3';
        seriesRange.contents.strokeWidth = 1;
        seriesRange.date = DateUtils.add(startDate, 1, 'd').toDate();
        seriesRange.endDate = DateUtils.add(endDate, 1, 'd').toDate();
      }
    }

    // 예측구간 색칠
    const predictRange = dateAxis.axisRanges.create();
    predictRange.text = 'predictRange';
    predictRange.label.inside = true;
    predictRange.label.text = 'AI예측';
    predictRange.label.valign = 'top';
    predictRange.label.location = 0.5;
    predictRange.label.opacity = 0.5;
    predictRange.date = DateUtils.add(startDate, 1, 'd').toDate();
    predictRange.endDate = DateUtils.add(endDate, 1, 'd').toDate();
    predictRange.grid.disabled = true;
    predictRange.axisFill.fill = am4core.color('#f0f060');
    predictRange.axisFill.fillOpacity = 0.4;

  }

  onSelectionChange(e) {
    if (e && e.options && e.options.length > 0) {
      const sampleId = e.options[0].value;

      this.buildChartData(sampleId);
      this.buildPredictChart(sampleId);
    }

    this.setYAxisDisabled();
  }

  onChageProperty(property, e) {
    this.propertyChecked[property.code] = e.selected;
    const series = this.series[property.code];
    if (series) {
      series.disabled = !e.selected;
      series.bullets.each((f) => (f.disabled = !e.selected));
    }

    this.setYAxisDisabled();
  }

  /**
   * y축 on/off
   */
  setYAxisDisabled() {
    for (const yAxis of Object.values(this.yAxes)) {
      const unit = yAxis.title.text || ' ';
      this.yAxes[unit].disabled = !this.chart.series.values.filter((s) => s.yAxis.title.text == unit).some((s) => !s.disabled);
    }
    // this.yAxes['cm '].disabled = false;
    this._changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {}
}
