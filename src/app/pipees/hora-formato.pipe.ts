import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horaFormato',
  standalone: true
})
export class HoraFormatoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
