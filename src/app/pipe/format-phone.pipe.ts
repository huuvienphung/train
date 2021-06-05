import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPhone',
})
export class FormatPhonePipe implements PipeTransform {
  transform(value: string, hide?: number): string {
    let str: string;

    let num = hide ? hide : 4;
    if (value.length <= num) {
      str = value;
    } else {
      let str1: string, str2: string;
      str1 = value.slice(0, value.length - num);
      str2 = value.slice(-num);

      let str3: string = '';
      let i: number = 0;
      while (i < str1.length) {
        str3 = str3 + '*';
        i++;
      }
      str = str3.concat(str2);
    }
    return str;
  }
}
