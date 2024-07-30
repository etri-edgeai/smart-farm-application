const DAY_SEC = 24 * 60 * 60;
const YEAR_SEC = 365.2425 * DAY_SEC ;

export class AiUtils {
  public static tempNorm = x => (x - 18.9) / 8.4;
  public static tempDenorm = x => x * 8.4 + 18.9;
  public static humidityNorm = x => x / 100;
  public static humidityDenorm = x => x * 100;
  public static co2Norm = x => (x - 726) / 333;
  public static co2Denorm = x => x * 333 + 726;

  public static dateToSincos(date: Date | number) {
    const timestamp = date instanceof Date ?  date.getTime() : date;
  
    return [
      Math.sin(timestamp * (2 * Math.PI / DAY_SEC)),
      Math.cos(timestamp * (2 * Math.PI / DAY_SEC)),
      Math.sin(timestamp * (2 * Math.PI / YEAR_SEC)),
      Math.cos(timestamp * (2 * Math.PI / YEAR_SEC)),
    ];
  }

}