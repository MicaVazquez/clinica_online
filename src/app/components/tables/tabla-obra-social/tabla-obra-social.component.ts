import { Component, EventEmitter, Output } from '@angular/core';
import { ObraSocialService } from '../../../services/obra-social.service';
import { NgClass, NgFor } from '@angular/common';

export interface ObraSocial {
  nombre: string;
}
@Component({
  selector: 'app-tabla-obra-social',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './tabla-obra-social.component.html',
  styleUrl: './tabla-obra-social.component.css',
})
export class TablaObraSocialComponent {
  @Output() public obras = new EventEmitter<string>();
  public rowClicked!: number;
  public obrasSociales: ObraSocial[] = [];

  constructor(private obraSocialService: ObraSocialService) {}

  /**
   * Traigo las Obras Sociales
   * y las cargo en la tabla.
   */
  ngOnInit(): void {
    this.obraSocialService.obtenerObrasSociales(this.obrasSociales);
    console.log('Obras sociales: ', this.obrasSociales);
  }

  /**
   * Para la row que se toque.
   * @param obra
   * @param idx
   */
  onClickRow(obra: any, idx: number) {
    if (this.rowClicked === idx) {
      this.rowClicked = -1;
      this.obras.emit('');
    } else {
      this.obras.emit(obra);
      this.rowClicked = idx;
    }
    console.log('rowClicked: ' + this.rowClicked);
  }
}
