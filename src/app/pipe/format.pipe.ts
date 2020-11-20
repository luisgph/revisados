import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'format'
})
export class FormatPipe implements PipeTransform {
  public 

  transform(value: any, args?: any): any {
    
    switch (args) {
      case 'formatDate':
        value = this.formatMonth(value);
        break;
      case 'formatHour':
          value = value.toString().padStart(4 ,'0');
          value = value.toString().substr(0,2) + ":"+ value.toString().substr(2,2);
        break;

      default:
        break;
    }
    return value;
  }

  formatMonth(value:any):any{
    value = value.toString().padStart(6 ,'0');
    let day = value.substr(0,2);
    let month = value.substr(2,2);
    let year = value.substr(4,2);
    
    switch (month) {
      case '01':
        month = 'JAN';          
        break;
        case '02':
        month = 'FEB';          
        break;
        case '03':
        month = 'MAR';          
        break;
        case '04':
        month = 'APR';          
        break;
        case '05':
        month = 'MAY';          
        break;
        case '06':
        month = 'JUN';          
        break;
        case '07':
        month = 'JUL';          
        break;
        case '08':
        month = 'AUG';          
        break;
        case '09':
        month = 'SEP';          
        break;
        case '10':
        month = 'OCT';          
        break;
        case '11':
        month = 'NOV';          
        break;
        case '12':
        month = 'DEC';          
        break;
    }
    value = day+month+year;
    return value;
  }
}
