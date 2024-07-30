import { Pipe, PipeTransform } from '@angular/core';
import { StringUtils } from '@libs/utils/string.utils';

@Pipe({
  name: 'phone',
  standalone: true
})
export class PhonePipe implements PipeTransform {
  transform(value: any, isSecure?: any): any {
    return StringUtils.setPhoneFormat(value, isSecure);
  }
}
