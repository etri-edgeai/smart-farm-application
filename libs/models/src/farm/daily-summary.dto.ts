export class DailySummary {
  date: string = '';

  ventRecommendDt?: Date;
  wateringRecommendDt?: Date;
  enterFitDt?: Date;
  hdFitDuration?: number; // 증산적합유지시간. 분

  tempAvgDay = Number.NaN;
  tempMinDay = Number.POSITIVE_INFINITY;
  tempMaxDay = Number.NEGATIVE_INFINITY;
  tempAvgDayTime = Number.NaN;
  tempMinDayTime = Number.POSITIVE_INFINITY;
  tempMaxDayTime = Number.NEGATIVE_INFINITY;
  // 아직 밤이 끝나지 않은 경우 값을 구할 수 없으므로 NaN으로 처리한다. json으로 null이 넘어간다.
  tempAvgNightTime = Number.NaN;
  tempMinNightTime = Number.POSITIVE_INFINITY;
  tempMaxNightTime = Number.NEGATIVE_INFINITY;

  tempDiffDayNight = Number.NaN;

  humAvgDay = Number.NaN;
  humAvgDayTime = Number.NaN;
  humAvgNightTime = Number.NaN;

  hdAvgDayTime = Number.NaN;

  tempUnder20 = 0;
  tempOver20 = 0;
  tempOver22 = 0;
  tempOver24 = 0;
  tempOver26 = 0;
  tempOver28 = 0;
  tempOver30 = 0;

  tempUnder20Day = 0;
  tempOver20Day = 0;
  tempOver22Day = 0;
  tempOver24Day = 0;
  tempOver26Day = 0;
  tempOver28Day = 0;
  tempOver30Day = 0;

  tempUnder20Night = 0;
  tempOver20Night = 0;
  tempOver22Night = 0;
  tempOver24Night = 0;
  tempOver26Night = 0;
  tempOver28Night = 0;
  tempOver30Night = 0;

  humUnder75 = 0;
  humOver75 = 0;
  humOver80 = 0;
  humOver85 = 0;
  humOver90 = 0;
  humOver95 = 0;

  humUnder75Day = 0;
  humOver75Day = 0;
  humOver80Day = 0;
  humOver85Day = 0;
  humOver90Day = 0;
  humOver95Day = 0;

  humUnder75Night = 0;
  humOver75Night = 0;
  humOver80Night = 0;
  humOver85Night = 0;
  humOver90Night = 0;
  humOver95Night = 0;
}
