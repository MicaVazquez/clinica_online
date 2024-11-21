import { Component } from '@angular/core';
import { EspecialistaService } from '../../../services/especialista.service';
import { EspecialidadService } from '../../../services/especialidad.service';
import { Especialista } from '../../../interfaces/especialista';
import { Especialidad } from '../../../interfaces/especialidad';
import { FormEspecialistaComponent } from '../../forms/form-especialista/form-especialista.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Route, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-especialistas',
  standalone: true,
  imports: [
    FormEspecialistaComponent,
    NgClass,
    NgIf,
    NgFor,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './especialistas.component.html',
  styleUrl: './especialistas.component.css',
})
export class EspecialistasComponent {
  public especialistas!: Especialista[]; //-->Para traer especialistas
  public especialidades!: Especialidad[]; //-->Para traer pacientes
  showFormComponent = false;
  isRegistrationSuccessful = false;
  constructor(
    private especialistaService: EspecialistaService,
    private especialidadService: EspecialidadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.especialistaService
      .traer()
      .subscribe((data) => (this.especialistas = data));
    this.especialidadService
      .traer()
      .subscribe((data) => (this.especialidades = data));
  }
  onActivarEspecialista(esp: Especialista) {
    console.log(esp);
    esp.active = !esp.active; //-->Cambio el estado
    for (const especialidad of esp.especialidad) {
      if (!this.containsNewEspecialidad(especialidad)) {
        //-->Si no esta la agrego
        this.especialidadService.agregarEspecialidad({
          nombre: especialidad,
          img: '',
        });
      }
    }

    //--> Hago update del especialista
    this.especialistaService.updateEspecialista(esp);
    //--> Vuelvo a traer a los especialistas
    this.especialistaService
      .traer()
      .subscribe((data) => (this.especialistas = data));
  }

  containsNewEspecialidad(esp: string) {
    for (const especialidad of this.especialidades) {
      if (esp === especialidad.nombre) {
        return true;
      }
    }
    return false;
  }

  onRegistrationSuccess(success: boolean) {
    if (success) {
      this.isRegistrationSuccessful = true;

      this.especialistaService
        .traer()
        .subscribe((data) => (this.especialistas = data));
    }
  }

  onAddEspecialistaAdmin() {
    this.showFormComponent = !this.showFormComponent;
  }
  goTo() {
    this.router.navigateByUrl('usuarios');
  }

  onDescargarEspecialistasExcel() {
    console.log('Generando Excel de especialistas...');

    // Definir los datos de los especialistas a exportar
    const especialistasData = this.especialistas.map((especialista) => ({
      Nombre: especialista.nombre,
      Apellido: especialista.apellido,
      Edad: especialista.edad,
      DNI: especialista.dni,
      Especialidades: especialista.especialidad.join(', '), // Unir las especialidades si son varias
      Email: especialista.email,
      Activo: especialista.active ? 'Sí' : 'No', // Mostrar como 'Sí' o 'No'
    }));

    // Crear una hoja de Excel a partir de los datos
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(especialistasData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Especialistas');

    // Descargar el archivo Excel
    const nombreFile = 'Especialistas_' + new Date().toISOString() + '.xlsx';
    XLSX.writeFile(wb, nombreFile);

    // Mostrar un mensaje de éxito con SweetAlert2
    Swal.fire({
      icon: 'success',
      title: 'Excel generado',
      text: 'El archivo Excel con los datos de los especialistas ha sido generado correctamente.',
    });
  }
}
