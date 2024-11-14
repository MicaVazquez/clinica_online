import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'existeHorarioEnTurnos',
  standalone: true
})
export class ExisteHorarioEnTurnosPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
