import { ChangeDetectorRef, Component } from '@angular/core';
import {
  DatoDinamico,
  HistoriaClinica,
} from '../../../interfaces/historia-clinica';
import { Paciente, PacienteService } from '../../../services/paciente.service';
import { Turno } from '../../../interfaces/turno';
import { HistoriaClinicaService } from '../../../services/historia-clinica.service';
import { AuthService } from '../../../services/auth.service';
import { TurnoService } from '../../../services/turno.service';
import Swal from 'sweetalert2';
import { NgFor, NgIf } from '@angular/common';
import { FavButtonComponent } from '../../fav-button/fav-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FocusBorderDirective } from '../../../directivas/focus-border.directive';
@Component({
  selector: 'app-mis-pacientes',
  standalone: true,
  imports: [
    NgIf,
    FavButtonComponent,
    NgFor,
    MatButtonModule,
    MatIconModule,
    FocusBorderDirective,
  ],
  templateUrl: './mis-pacientes.component.html',
  styleUrl: './mis-pacientes.component.css',
})
export class MisPacientesComponent {
  public historiaClinica: HistoriaClinica[] = [];
  public especialistaEmail!: string;
  public pacientes: Paciente[] = [];
  public todosHistorialesClinicos: HistoriaClinica[] = [];
  public paciente!: Paciente;
  public turnos: Turno[] = [];
  public historialMostrar: HistoriaClinica[] = [];

  constructor(
    private pacienteService: PacienteService,
    private historiaClinicaService: HistoriaClinicaService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private turnosService: TurnoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getUserLogged().subscribe((user) => {
      this.especialistaEmail = user?.email!;
      this.pacienteService.traer().subscribe((pacientes) => {
        for (const paciente of pacientes) {
          this.historiaClinicaService
            .traerHistorialClinicoPorID(paciente.idDoc)
            .subscribe((historiales) => {
              for (const historial of historiales) {
                if (historial.emailEspecialista === this.especialistaEmail) {
                  this.todosHistorialesClinicos.push(historial);

                  if (!this.pacientes.some((p) => p.email === paciente.email)) {
                    this.pacientes.push(paciente);
                    this.cdr.detectChanges();
                  }
                }
              }
            });

          this.turnosService
            .getTurnosByEmailPaciente(paciente.email)
            .subscribe((turnos) => {
              for (const turno of turnos) {
                if (turno.emailEspecialista === this.especialistaEmail) {
                  this.turnos.push(turno);
                }
              }

              this.cdr.detectChanges();
            });
        }
      });
    });
  }

  getPaciente(email: string): string {
    const paciente = this.pacientes.find((p) => p.email === email);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : '';
  }

  sacarKey(datos: DatoDinamico): string {
    return Object.keys(datos)[0];
  }

  onGetHistorial(paciente: Paciente): void {
    this.historiaClinica = this.todosHistorialesClinicos.filter(
      (his) => his.emailPaciente === paciente.email
    );
    this.historialMostrar = [...this.historiaClinica]; // Hacer una copia para evitar mutaciones inesperadas
    this.cdr.detectChanges();
  }

  getReseniaByEmailAndEspecialidad(
    email: string,
    especialidad: string
  ): string {
    const turno = this.turnos.find(
      (t) =>
        t.emailPaciente === email &&
        t.especialidad === especialidad &&
        t.resenia !== ''
    );
    return turno ? turno.resenia : '';
  }

  getTurno(emailPaciente: string, especialidad: string): Turno | undefined {
    return this.turnos.find(
      (t) =>
        t.emailPaciente === emailPaciente &&
        t.especialidad === especialidad &&
        t.resenia !== ''
    );
  }

  onReset() {
    this.historiaClinica = [];
    this.historialMostrar = [];
    this.cdr.detectChanges();
  }

  onVerResenia(turno?: Turno): void {
    if (turno && turno.resenia) {
      Swal.fire({
        title: 'Información de la reseña.',
        text: turno.resenia,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: 'darkslategray',
        background: 'antiquewhite',
      });
    } else {
      Swal.fire({
        title: 'No se ha escrito una reseña todavía.',
        icon: 'info',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: 'darkslategray',
        background: 'antiquewhite',
      });
    }
  }

  //////////////////////////////////////////// FILTRADO ////////////////////////////////////////////

  contieneSubcadenaIgnoreCase(
    cadenaPrincipal: any,
    subcadena: string
  ): boolean {
    if (typeof cadenaPrincipal !== 'string') {
      cadenaPrincipal = String(cadenaPrincipal);
    }
    return cadenaPrincipal.toLowerCase().includes(subcadena.toLowerCase());
  }

  contieneSubcadenaIgnoreCaseDatos(
    datos: DatoDinamico[],
    subcadena: string
  ): boolean {
    return datos.some((dato) =>
      Object.keys(dato).some(
        (key) =>
          this.contieneSubcadenaIgnoreCase(key, subcadena) ||
          this.contieneSubcadenaIgnoreCase(dato[key], subcadena)
      )
    );
  }

  onFiltrarHistorial(event: any): void {
    const valor = event.target.value;

    if (valor === '') {
      this.historialMostrar = [...this.historiaClinica];
    } else {
      this.historialMostrar = this.historiaClinica.filter(
        (hist) =>
          this.contieneSubcadenaIgnoreCase(hist.altura, valor) ||
          this.contieneSubcadenaIgnoreCase(hist.emailEspecialista, valor) ||
          this.contieneSubcadenaIgnoreCase(hist.peso, valor) ||
          this.contieneSubcadenaIgnoreCase(hist.especialidad, valor) ||
          this.contieneSubcadenaIgnoreCase(
            this.getPaciente(hist.emailPaciente),
            valor
          ) ||
          this.contieneSubcadenaIgnoreCase(hist.presion, valor) ||
          this.contieneSubcadenaIgnoreCase(hist.temperatura, valor) ||
          this.contieneSubcadenaIgnoreCaseDatos(hist.datos, valor)
      );
      console.log(valor);
    }
    this.cdr.detectChanges();
  }
  goTo() {
    this.router.navigateByUrl('especialista');
  }
}
