import { Component } from '@angular/core';
import { Turno } from '../../../interfaces/turno';
import { Paciente, PacienteService } from '../../../services/paciente.service';
import { AuthService } from '../../../services/auth.service';
import { TurnoService } from '../../../services/turno.service';
import { CurrentUserService } from '../../../services/current-user.service';
import { NgFor, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { CargarHistorialComponent } from '../../cargar-historial/cargar-historial.component';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FocusBorderDirective } from '../../../directivas/focus-border.directive';

@Component({
  selector: 'app-esp-turnos',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    CargarHistorialComponent,
    MatIcon,
    MatButtonModule,
    FocusBorderDirective,
  ],
  templateUrl: './esp-turnos.component.html',
  styleUrl: './esp-turnos.component.css',
})
export class EspTurnosComponent {
  ////////////////////////// ATRIBUTOS //////////////////////////
  public email!: string;
  public turnos: Turno[] = [];
  public turnosMostrar: Turno[] = [];
  public pacientes: Paciente[] = [];
  public mostrarHistorial: boolean = false;

  ////////////////////////// CONSTRUCTOR & ONINIT //////////////////////////
  constructor(
    private authService: AuthService,
    private turnoService: TurnoService,
    private pacienteService: PacienteService,
    private cUser: CurrentUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pacienteService.traer().subscribe((data) => (this.pacientes = data));

    //-->Obtengo los turnos que mostrare.
    this.getTurnos();
  }

  ////////////////////////// METODOS //////////////////////////

  /**
   * Me permitira obtener los turnos
   * del especialista que esta logueado.
   */
  private getTurnos() {
    //-->Obtengo al especialista
    this.authService.getUserLogged().subscribe((usuario) => {
      if (usuario) {
        //-->Paso el mail
        this.email = usuario?.email!;
        //-->Traigo los turnos del especialista:
        this.turnoService
          .getTurnosByEmailEspecialista(this.email)
          .subscribe((turnos) => {
            if (turnos) {
              this.turnos = turnos;
              this.turnosMostrar = turnos;
              console.log('Turnos del especialista: ', this.turnos);
            }
          });
      }
    });
  }

  /**
   * Me permitira obtener un paciente
   * por su email, retornando el nombre
   * completo.
   * @param email el email del paciente
   * @returns retorna el nombre completo
   * del paciente
   */
  getPaciente(email: string): string {
    let nombre = '';
    for (const paciente of this.pacientes) {
      if (paciente.email === email) {
        nombre = paciente.nombre + ' ' + paciente.apellido;
        break;
      }
    }
    return nombre;
  }

  /**
   * Me permitira aceptar un turno
   * de un paciente. Se cambiara
   * el estado del turno de 'pendiente'
   * a 'aceptado'
   * @param turno el turno a ser
   * aceptado.
   */
  onAceptar(turno: Turno): void {
    Swal.fire({
      title: '¿Deseas tomar el turno?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: 'darkslategray', //-->Color del boton de confirmar
      background: 'antiquewhite', //-->Color de fondo
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          title: 'Turno tomado',
          icon: 'success',
          text: `Turno programado para ${turno.fecha} a las ${turno.horario.hora} en el consultorio ${turno.horario.nroConsultorio}.`,
          confirmButtonColor: 'darkslategray', //-->Color del boton de confirmar
          background: 'antiquewhite', //-->Color de fondo
        }).then(() => {
          //-->Cambio el estado del turno
          turno.estado = 'aceptado';
          this.turnoService.updateTurno(turno);
          this.getTurnos(); //-->Vuelvo a traer los turnos.
        });
      }
    });
  }

  /**
   * Me permitira ver la calificacion
   * del turno. (la da el paciente.)
   * @param turno el turno
   * que se desea ver su
   * calificacion
   */
  onVerCalificacion(turno: Turno): void {
    Swal.fire({
      title: 'Calificacion del turno',
      text: turno.calificacion,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: 'darkslategray', //-->Color del boton de confirmar
      background: 'antiquewhite', //-->Color de fondo
    });
  }

  /**
   * Podra finalizar un turno,
   * es decir, ya fue atendido y
   * se hizo una reseña etc.
   * @param turno el turno que
   * se pretende finalizar
   */
  async onFinalizar(turno: Turno) {
    Swal.fire({
      title: '¿Deseas finalizar el turno?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: 'darkslategray', //-->Color del boton de confirmar
      background: 'antiquewhite', //-->Color de fondo
    }).then(async (res) => {
      if (res.isConfirmed) {
        const { value: text } = await Swal.fire({
          input: 'textarea',
          inputLabel: 'Finalización del turno.',
          inputPlaceholder:
            'Ingrese el diagnóstico o reseña de la consulta con el paciente..',
          inputAttributes: {
            'aria-label': 'Type your message here',
          },
          showCancelButton: true,
          //-->Estilos del sweet alert
          confirmButtonColor: 'darkslategray',
          confirmButtonText: 'Finalizar Turno.',
          background: 'antiquewhite',
        });

        //-->Si escribio:
        if (text) {
          Swal.fire({
            title: 'Turno finalizado',
            icon: 'success',
            text: `El paciente fue atendido!`,
            confirmButtonColor: 'darkslategray',
            confirmButtonText: 'Ok',
            background: 'antiquewhite',
          }).then(() => {
            turno.resenia = text;
            turno.estado = 'finalizado';
            console.log('Turno finalizado: ', turno);

            this.turnoService.updateTurno(turno);
            this.getTurnos(); //-->Vuelvo a traer los turnos.
          });
        }
      }
    });
  }

  /**
   * Me permitira rechazar un turno,
   * se cambia el estado y el especialista
   * escribe una reseña de porque se rechazo.
   * @param turno el turno que
   * el especialista quiere rechazar.
   */
  async onRechazar(turno: Turno) {
    Swal.fire({
      title: '¿Deseas rechazar el turno?',
      icon: 'question',
      showCancelButton: true,
      text: 'No podrá revertirlo.',
      //-->Estilos del sweet alert
      confirmButtonColor: 'darkslategray',
      confirmButtonText: 'Rechazar Turno.',
      background: 'antiquewhite',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value: text } = await Swal.fire({
          input: 'textarea',
          inputLabel: 'Rechazar el Turno',
          inputPlaceholder:
            'Ingrese la razón por la cual quiere rechazar el turno.',
          inputAttributes: {
            'aria-label': 'Type your message here',
          },
          showCancelButton: true,
          //-->Estilos del sweet alert
          confirmButtonColor: 'darkslategray',
          confirmButtonText: 'Rechazar Turno.',
          background: 'antiquewhite',
        });

        //-->Si contesto el input
        if (text) {
          Swal.fire({
            title: 'Turno Rechazado!',
            icon: 'success',
            text: `Turno rechazado por: "${text}".`,
            //-->Estilos del sweet alert
            confirmButtonColor: 'darkslategray',
            confirmButtonText: 'Ok',
            background: 'antiquewhite',
          }).then(() => {
            turno.estado = 'rechazado';
            turno.resenia = text;
            this.turnoService.updateTurno(turno); //-->Updateo el turno
            this.getTurnos();
          });
        }
      }
    });
  }

  /**
   * Me permitira cancelar un turno ya
   * aceptado.
   * @param turno el turno a cancelar
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

  ////////////////////////// HISTORIAL //////////////////////////

  async onCargarHistoriaClinica(turno: Turno) {
    this.mostrarHistorial = true;
    this.cUser.idPacienteHistorial = this.getIdPaciente(turno.emailPaciente);
    this.cUser.turno = turno;
  }

  /**
   * Me permitira buscar a un usuario
   * mediante su email para asi conseguir
   * su ID.
   * @param emailPaciente el email
   * del paciente del cual deberé
   * obtetener su ID
   * @returns retorna el string
   * que es la ID.
   */
  private getIdPaciente(emailPaciente: string): string {
    for (const pac of this.pacientes) {
      if (pac.email === emailPaciente) {
        return pac.idDoc;
      }
    }
    return '';
  }

  onGetHistorial(historial: boolean) {
    this.mostrarHistorial = historial;
    this.getTurnos();
  }

  ////////////////////////// FILTRADO //////////////////////////

  private contieneSubcadenaIgnoreCase(
    cadenaPrincipal: string,
    subcadena: string
  ): boolean {
    return cadenaPrincipal.toLowerCase().includes(subcadena.toLowerCase());
  }

  /**
   * Me permitira filtrar
   * los turnos por el input
   * que ingrese el paciente.
   * @param event
   */
  onFiltrarTurnos(event: any): void {
    const valor = event.target.value;

    if (valor === '') this.turnosMostrar = this.turnos;
    else {
      this.turnosMostrar = [];

      //-->Recorro y muestro.
      for (const turno of this.turnos) {
        if (
          this.contieneSubcadenaIgnoreCase(turno.estado, valor) ||
          this.contieneSubcadenaIgnoreCase(turno.fecha, valor) ||
          this.contieneSubcadenaIgnoreCase(turno.horario.hora, valor) ||
          this.contieneSubcadenaIgnoreCase(turno.especialidad, valor) ||
          this.contieneSubcadenaIgnoreCase(
            this.getPaciente(turno.emailPaciente),
            valor
          )
        )
          this.turnosMostrar.push(turno);
      }
    }
  }
  goTo() {
    this.router.navigateByUrl('especialista');
  }
}
