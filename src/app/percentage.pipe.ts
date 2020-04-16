import { Pipe, PipeTransform } from '@angular/core';
import { stringify } from 'querystring';

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {

  transform(value: number, total:number): string {
    if(value==undefined){
      return ''
    }
    else if(total==0){
      return 0+'%'
    }
    else if(total==-1){
      return Math.floor(value)+'%'
    }
    
    return Math.floor((value/total)*100)+'%'
  }

}
