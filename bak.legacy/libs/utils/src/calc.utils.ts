export class CalcUtils {
  /**
   * nan to null
   * @param num 
   * @returns 
   */
  public static nanToNull(num: string|number) {
    if (num == null) return null;
    return isNaN(+num) ? null : +(+num).toFixed(12);
  }

}