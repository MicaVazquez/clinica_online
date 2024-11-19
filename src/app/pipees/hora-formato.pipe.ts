import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horaFormato',
  standalone: true,
})
export class HoraFormatoPipe implements PipeTransform {
  transform(hora: string): string {
    if (!hora) {
      return '';
    }
    const [horas, minutos] = hora.split(':');
    let formato12h = '';
    const horaNumero = parseInt(horas, 10);
    if (horaNumero >= 12) {
      formato12h = horaNumero === 12 ? '12' : (horaNumero - 12).toString();
      formato12h += `:${minutos} pm`;
    } else {
      formato12h = horaNumero === 0 ? '12' : horaNumero.toString();
      formato12h += `:${minutos} am`;
    }
    return formato12h;
  }
}
