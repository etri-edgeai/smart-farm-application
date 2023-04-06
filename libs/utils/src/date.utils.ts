// 모든 시간관련 로직은 time zone을 고려해야 한다
// date, string 변환을 format으로 하는게 낫겠다. 그리고 format에 대한 options list를 만들어 줘서 선택하는 방식도 괜찮을듯

import moment from 'moment';
import { getTimes } from './sunrise/sunrise';

export enum AMPM_TYPE {
  AM = 'A', PM = 'P', DAY = 'D'
};

export class DateUtils {
  public static simpleDateFormat = 'YYYY-MM-DD';
  public static simpleTimeFormat = 'HH:mm:ss';
  private static defaultLatitude = 37.5263625;
  private static defaultLongitude = 126.9404481;

  public static getMoment() {
    return moment;
  }

  public static toMoment(date: moment.MomentInput) {
    // moment(date) 로 할 수도 있지만, 퍼포먼스를 위해 isMoment()로 체크한다
    return moment.isMoment(date) ? date : moment(date);
  }

  public static toDate(date: moment.MomentInput) {
    return date instanceof Date ? date : DateUtils.toMoment(date).toDate();
  }

  public static dayKeyToDate(dayKey: number|string) {
    dayKey = +dayKey;
    return new Date(Math.floor(dayKey / 10000), Math.floor((dayKey % 10000) / 100) - 1, dayKey % 100);
  }

  public static format(date: moment.MomentInput, format: string = DateUtils.simpleDateFormat + ' ' + DateUtils.simpleTimeFormat) {
    return DateUtils.toMoment(date).format(format);
  }

  public static toDateString(date: moment.MomentInput) {
    return DateUtils.format(date, DateUtils.simpleDateFormat);
  }

  public static toTimeString(date: moment.MomentInput) {
    return DateUtils.format(date, DateUtils.simpleTimeFormat);
  }

  public static toDateTimeString(date: moment.MomentInput) {
    return DateUtils.toDateString(date) + ' ' + DateUtils.toTimeString(date);
  }

  public static from(dateString: string, format: string = DateUtils.simpleDateFormat + ' ' + DateUtils.simpleTimeFormat) {
    return moment(dateString, format);
  }

  /**
   * 일출/일몰
   * @param date 일자
   * @param latitude 위도
   * @param longitude 경도
   * @returns [일출, 일몰]
   */
  public static getSunriseSunset(date: moment.MomentInput, latitude?: number, longitude?: number) {
    const _date = DateUtils.toDate(date);
    const times = getTimes(_date, latitude || this.defaultLatitude, longitude || this.defaultLongitude);
    return [times.sunrise, times.sunset];
  }

  public static toDayKey(date: moment.MomentInput) {
    return +DateUtils.format(date, 'YYYYMMDD');
  }

  public static add(date: moment.MomentInput, amount: number, unit: moment.unitOfTime.DurationConstructor = 'd') {
    return DateUtils.toMoment(date).add(amount, unit);
    // return DateUtils.toType(added, date);
  }

  public static toType(date: moment.MomentInput, origin?: moment.MomentInput, type?: "string"|"number"|"Moment"|"Date"|"Timestamp") {
    let newType;
    if (origin) {
      if (date instanceof Date) {
        newType = "Date";
      } else if (typeof date === 'number') { // timestamp or yyyymmdd
          if (date > 21000000) { // assume timestamp
            newType = "Timestamp";
          }
          newType = "number";
      } else if (typeof date === 'string') {
          newType = "string";
      } else if (date instanceof moment) {
        newType = 'moment';
      }
    }

    if (type) {
      newType = type;
    }

    switch(newType) {
      case "string": return DateUtils.format(date, DateUtils.simpleDateFormat);
      case "number": return DateUtils.toDayKey(date);
      case "Date": return DateUtils.toDate(date);
      case "Timestamp": return DateUtils.toMoment(date).valueOf();
      case "Moment":
      default: return DateUtils.toMoment(date);
    }
  }

  static diff(date1: moment.MomentInput, date2: moment.MomentInput = new Date(), unit: moment.unitOfTime.Diff = 'd'): number {
    const d1 = DateUtils.toMoment(date1);
    const d2 = DateUtils.toMoment(date2);
    return d1.diff(d2, unit);
  }

  static diffS(date1: moment.MomentInput, date2: moment.MomentInput = new Date()): number {
    const d1 = DateUtils.toMoment(date1);
    const d2 = DateUtils.toMoment(date2);
    return d1.diff(d2, 'seconds');
  }

  static diffM(date1: moment.MomentInput, date2: moment.MomentInput = new Date()): number {
      const d1 = DateUtils.toMoment(date1);
      const d2 = DateUtils.toMoment(date2);
      return d1.diff(d2, 'minutes');
  }

}

