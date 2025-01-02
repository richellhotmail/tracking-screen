import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterData'
})
export class FilterDataPipe implements PipeTransform {
  transform(items: any[], searchTerm: string): any[] {
    if (!items || !searchTerm) {
      return items;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return items.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
  }
}
