import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Paciente } from '../../services/paciente.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-fav-button',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './fav-button.component.html',
  styleUrl: './fav-button.component.css',
})
export class FavButtonComponent {
  ///////////////////////////////////////// ATRIBUTOS /////////////////////////////////////////
  @Input() pacientes: Paciente[] = [];
  @Output() pacienteSeleccionado = new EventEmitter<Paciente>();
  isDropdownOpen = false;

  ///////////////////////////////////////// METODOS /////////////////////////////////////////
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectPaciente(paciente: Paciente) {
    this.pacienteSeleccionado.emit(paciente);
    this.toggleDropdown();
  }
}
