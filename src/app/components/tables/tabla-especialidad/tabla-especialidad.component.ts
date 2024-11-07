import { Component } from '@angular/core';
import { Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Especialidad } from '../../../interfaces/especialidad';
import { EspecialidadService } from '../../../services/especialidad.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-tabla-especialidad',
  standalone: true,
  imports: [NgIf, NgClass, NgFor],
  templateUrl: './tabla-especialidad.component.html',
  styleUrl: './tabla-especialidad.component.css',
})
export class TablaEspecialidadComponent {
  @Output() public especialidad = new EventEmitter<string>();
  @ViewChild('especialidadInput') especialidadInput!: ElementRef;
  public rowsClicked: number[] = [];
  public especialidades: Especialidad[] = [];
  public error: boolean = false;

  @Input() isAdmin: boolean = false; //--> Para controlar mostrar el btn

  constructor(private especialidadService: EspecialidadService) {}

  ngOnInit(): void {
    this.especialidadService.obtenerEspecialidades(this.especialidades);
    console.log('Array de especialidades: ', this.especialidades);
  }

  onClickRow(obra: any, idx: number) {
    if (this.rowsClicked.includes(idx)) {
      this.rowsClicked.splice(this.rowsClicked.indexOf(idx), 1);
    } else {
      this.rowsClicked.push(idx);
    }

    this.especialidad.emit(obra);
    console.log('rowClicked: ' + this.rowsClicked);
  }

  quitarAcentos(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  addEspecialidad() {
    const especialidad = this.especialidadInput.nativeElement.value;
    const nuevaEspecialidad = this.quitarAcentos(especialidad);
    this.error = false;
    const esp = { nombre: nuevaEspecialidad } as Especialidad;

    this.especialidades.forEach((e) => {
      if (e.nombre.toLowerCase() == esp.nombre.toLowerCase()) {
        this.error = true;
        return;
      }
    });

    if (!this.error) {
      this.especialidadService.agregarEspecialidad(esp);
      this.especialidadInput.nativeElement.value = '';
    }
  }
}
