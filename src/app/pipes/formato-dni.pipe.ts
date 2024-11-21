import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoDni',
  standalone: true,
})
export class FormatoDniPipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) return '';

    // Asegurar que el valor sea una cadena
    const dni = value.toString();

    // Insertar puntos cada tres dígitos desde el final
    return dni.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
