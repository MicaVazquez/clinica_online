import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertirDiaATexto',
  standalone: true
})
export class ConvertirDiaATextoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
