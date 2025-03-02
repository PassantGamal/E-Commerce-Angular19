import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(products: any[], kelma: string): any[] {
    return products.filter((item) =>
      item.title.toLowerCase().includes(kelma.toLowerCase())
    );
  }
}
