import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'enumToArray', standalone: true})
export class EnumToArrayPipe implements PipeTransform {
  transform(value) {
    return Object.keys(value).filter(e => isNaN(+e)).map(o => { return {key: o, value: +value[o]}});
  }
}
