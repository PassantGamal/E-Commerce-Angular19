import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sale',
})
export class SalePipe implements PipeTransform {
  transform(value: string): string {
    return `OnSale ${value}`;
  }
}
