import { Component } from '@angular/core';
import { Turno } from '../../../interfaces/turno';
import { Especialista } from '../../../interfaces/especialista';
import { Especialidad } from '../../../interfaces/especialidad';
import { TurnoService } from '../../../services/turno.service';
import { EspecialistaService } from '../../../services/especialista.service';
import { EspecialidadService } from '../../../services/especialidad.service';
import Swal from 'sweetalert2';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TraceCursorDirective } from '../../../directivas/trace-cursor.directive';
@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatProgressSpinner,
    MatIconModule,
    MatButtonModule,
    TraceCursorDirective,
  ],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css',
})
export class TurnosComponent {
  //////////////////////////////////// ATRIBUTOS ////////////////////////////////////
  public turnos: Turno[] = [];
  public turnosDisponibles: Turno[] | null = null;
  public filtroSeleccionado: string = '';
  public especialidadSeleccionada: string = '';
  public especialistaSeleccionado: Especialista | null = null;
  public especialistas: Especialista[] = [];
  public especialidades: Especialidad[] = [];
  public isLoading: boolean = false;
  public turnosCargados: boolean = true;

  //////////////////////////////////// CTOR & ONINIT ////////////////////////////////////
  constructor(
    private turnoService: TurnoService,
    private especialistaService: EspecialistaService,
    private especialidadService: EspecialidadService,
    private router: Router
  ) {}

  /**
   * Me traigo los turnos, los
   * especialistas y las especialidades.
   */
  ngOnInit(): void {
    this.turnoService
      .traerTurnos()
      .subscribe((turnos) => (this.turnos = turnos));

    this.especialidadService
      .traer()
      .subscribe((especialidades) => (this.especialidades = especialidades));

    this.especialistaService
      .traer()
      .subscribe((especialistas) => (this.especialistas = especialistas));
  }

  //////////////////////////////////// METODOS ////////////////////////////////////
  /**
   * Me permitira resetear
   * todos los valores.
   */
  onReset() {
    if (!this.filtroSeleccionado) {
      this.goTo();
    } else {
      this.filtroSeleccionado = '';
      this.especialidadSeleccionada = '';
      this.especialistaSeleccionado = null;
      this.turnosDisponibles = null;
    }
  }

  /**
   * Me permitira filtrar los
   * turnos, por especialidad, especialista
   * o mostrarlos todos.
   * @param seleccion la opcion
   * seleccionada por parte del admin.
   */
  onSetFiltro(seleccion: string): void {
    this.isLoading = true; //-->Cargando
    setTimeout(() => {
      this.filtroSeleccionado = seleccion;

      //-->Para el filtro
      if (this.filtroSeleccionado == 'todos')
        this.turnosDisponibles = this.turnos;
      else this.turnosDisponibles = [];

      this.isLoading = false; //-->Termino de cargar
    }, 1000);
  }

  /**
   * Guardara en un array los turnos
   * disponibles de un especialista mediante
   * la coincidencia de su email.
   * @param especialista el especialist
   * seleccionado.
   */
  onSetEspecialista(especialista: Especialista): void {
    this.isLoading = true;

    setTimeout(() => {
      this.especialistaSeleccionado = especialista;
      for (const turno of this.turnos) {
        if (turno.emailEspecialista === especialista.email)
          this.turnosDisponibles?.push(turno);
      }

      if (!this.turnos) this.turnosCargados = false;
      this.isLoading = false;
    }, 1000);
  }

  onSetEspecialidad(especialidad: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.especialidadSeleccionada = especialidad;
      for (const turno of this.turnos) {
        if (
          this.getData(turno.emailEspecialista)?.especialidad.includes(
            especialidad
          )
        )
          this.turnosDisponibles?.push(turno);
      }

      if (!this.turnos) this.turnosCargados = false;
      this.isLoading = false;
    }, 1000);
  }

  /**
   * Me permitira buscar si existe
   * el email del especialista que recibo.
   * @param email el email del
   * especialista
   * @returns si lo encuentra lo retorna,
   * sino retorna null.
   */
  private getData(email: string): Especialista | null {
    for (const especialista of this.especialistas) {
      if (especialista.email === email) return especialista;
    }
    return null;
  }

  getEspecialista(email: string): string {
    let nombre = '';
    for (const esp of this.especialistas) {
      if (esp.email === email) {
        nombre = `${esp.nombre} ${esp.apellido}`;
        break;
      }
    }
    return nombre;
  }

  /**
   * Me permitira cancelarle
   * el turno a un paciente.
   * @param turno el turno
   * a cancelar.
   */
  async onCancelar(turno: Turno) {
    Swal.fire({
      title: '¿Desea cancelar el turno?',
      icon: 'question',
      showCancelButton: true,
      text: 'No podrá revertirlo.',

      //-->Estilos del sweet alert
      confirmButtonColor: 'darkslategray',
      confirmButtonText: 'Cancelar Turno.',
      background: 'antiquewhite',
    }).then(async (result) => {
      //-->Si desea cancelar el turno:
      if (result.isConfirmed) {
        const { value: text } = await Swal.fire({
          title: '¿Por qué cancela el turno?', //-->Pregunta
          input: 'text', //-->Tipo de input
          inputPlaceholder: 'Escriba la razón', //-->Placeholder
          inputAttributes: {
            'aria-label': 'Type your message here',
          },
          showCancelButton: true, //-->Boton de cancelar
          confirmButtonText: 'Cancelar Turno.', //-->Boton de confirmar
          confirmButtonColor: 'darkslategray', //-->Color del boton de confirmar
          background: 'antiquewhite', //-->Color de fondo
        });

        //-->Si escribiio la razon:
        if (text) {
          //-->Actualizo el turno
          Swal.fire({
            title: 'Turno cancelado',
            text: 'El turno ha sido cancelado con éxito',
            icon: 'success',
            background: 'antiquewhite', //-->Color de fondo
          }).then(() => {
            turno.resenia = text;
            turno.estado = 'cancelado';
            this.turnoService.updateTurno(turno);
            this.getTurnos(); //-->Cargo los turnos de nuevo
          });
        }
      }
    });
  }

  /**
   * Me permitira obtener los
   * turnos de un especialista.
   */
  private getTurnos() {
    this.turnoService
      .getTurnosByEmailEspecialista(this.especialistaSeleccionado?.email!)
      .subscribe((turnos) => {
        if (turnos) {
          this.turnos = turnos;
          this.turnosDisponibles = turnos;
          console.log('Turnos del especialista: ', this.turnos);
        }
      });
  }

  goTo() {
    this.router.navigateByUrl('usuarios');
  }
}
