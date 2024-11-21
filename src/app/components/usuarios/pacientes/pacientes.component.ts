import { Component } from '@angular/core';
import { Paciente, PacienteService } from '../../../services/paciente.service';
import { NgFor, NgIf } from '@angular/common';
import { FormPacienteComponent } from '../../forms/form-paciente/form-paciente.component';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { TurnoService } from '../../../services/turno.service';
import * as XLSX from 'xlsx';
import {
  DatoDinamico,
  HistoriaClinica,
} from '../../../interfaces/historia-clinica';
import { EspecialistaService } from '../../../services/especialista.service';
import { Especialista } from '../../../interfaces/especialista';
import { CambiarColorCardDirective } from '../../../directivas/cambiar-color-card.directive';
@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormPacienteComponent,
    MatButtonModule,
    MatIconModule,
    CambiarColorCardDirective,
  ],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css',
})
export class PacientesComponent {
  pacientes: any[] = []; // Array de pacientes
  pacienteSelect: any = null; // Paciente seleccionado
  public showFormComponent = false;
  isRegistrationSuccessful = false;
  public historialClinico: HistoriaClinica[] = [];
  public especialistas: Especialista[] = [];
  showPacientes = true;
  constructor(
    public pacienteSrv: PacienteService,
    private router: Router,
    private turnoService: TurnoService,
    private esp: EspecialistaService
  ) {}
  ngOnInit() {
    this.pacienteSrv
      .traer()
      .subscribe((pacientes) => (this.pacientes = pacientes));
    this.esp.traer().subscribe((esp) => (this.especialistas = esp));
  }
  onAddPacienteAdmin() {
    this.showFormComponent = !this.showFormComponent;
  }

  onRegistrationSuccess(success: boolean) {
    if (success) {
      this.isRegistrationSuccessful = true;
      this.pacienteSrv
        .traer()
        .subscribe((pacientes) => (this.pacientes = pacientes));
    }
  }
  goTo() {
    this.router.navigateByUrl('usuarios');
  }
  onCardClick(paciente: Paciente): void {
    // Llama al servicio para obtener los turnos
    this.turnoService
      .getTurnosByEmailPaciente(paciente.email)
      .subscribe((turnos) => {
        if (turnos.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin turnos',
            text: 'Este paciente no tiene turnos generados.',
          });
        } else {
          // Generar Excel con los turnos del paciente
          this.generarExcel(turnos, paciente);
          // this.generarExcel(turnos, paciente);
        }
      });
  }

  generarExcel(turnos: any[], paciente: Paciente): void {
    // Prepara los datos para la hoja de cálculo
    const datosExcel = turnos.map((turno) => ({
      Fecha: turno.fecha,
      Hora: turno.horario.hora,
      Consultorio: turno.horario.nroConsultorio || 'N/A',
      Especialidad: turno.especialidad,
      Estado: turno.estado,
      Calificación: turno.calificacion || 'N/A',
      Reseña: turno.resenia || 'Sin reseña',
      Historial: turno.historial ? 'Sí' : 'No',
    }));

    // Nombre del archivo
    const nombreArchivo = `Turnos_${paciente.nombre}_${paciente.apellido}.xlsx`;

    // Crea la hoja de cálculo
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExcel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Turnos');

    // Descarga el archivo
    XLSX.writeFile(wb, nombreArchivo);

    Swal.fire({
      icon: 'success',
      title: 'Excel generado',
      text: `El archivo Excel con los turnos ha sido generado correctamente.`,
    });
  }

  onDescargarPacientesExcel() {
    console.log('Generando Excel de pacientes...');

    // Definir los datos de los pacientes a exportar
    const pacientesData = this.pacientes.map((paciente) => ({
      Nombre: paciente.nombre,
      Apellido: paciente.apellido,
      DNI: paciente.dni,
      Edad: paciente.edad,
      Email: paciente.email,
      ObraSocial: paciente.obraSocial,
    }));

    // Crear una hoja de Excel a partir de los datos
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(pacientesData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pacientes');

    // Descargar el archivo Excel
    const nombreFile = 'Pacientes_' + new Date().toISOString() + '.xlsx';
    XLSX.writeFile(wb, nombreFile);

    // Mostrar un mensaje de éxito con SweetAlert2
    Swal.fire({
      icon: 'success',
      title: 'Excel generado',
      text: 'El archivo Excel con los datos de los pacientes ha sido generado correctamente.',
    });
  }

  getHistorial(paciente: Paciente) {
    console.log(paciente);
    this.pacienteSrv
      .traerHistorialClinicoPorId(paciente.idDoc)
      .subscribe((historial) => {
        this.historialClinico = historial;
        console.log(this.historialClinico);
      });
  }
  reset() {
    this.historialClinico = [];
  }

  sacarKey(datos: DatoDinamico) {
    return Object.keys(datos)[0];
  }

  getEspecialista(email: string): string {
    for (const esp of this.especialistas) {
      if (esp.email === email) {
        return `${esp.nombre} ${esp.apellido}`;
      }
    }
    return '';
  }
}
