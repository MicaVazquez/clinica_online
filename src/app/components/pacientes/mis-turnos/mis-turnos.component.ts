import { Component } from '@angular/core';
import { Turno } from '../../../interfaces/turno';
import { Especialista } from '../../../interfaces/especialista';
import { AuthService } from '../../../services/auth.service';
import { TurnoService } from '../../../services/turno.service';
import { EspecialistaService } from '../../../services/especialista.service';
import Swal from 'sweetalert2';
import { NgFor, NgIf } from '@angular/common';
import { DoctorPipe } from '../../../pipes/doctor.pipe';
import { HoraFormatoPipe } from '../../../pipees/hora-formato.pipe';
import { Router } from '@angular/router';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DoctorPipe,
    HoraFormatoPipe,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css',
})
export class MisTurnosComponent {
  ////////////////////////// ATRIBUTOS //////////////////////////
  public email: string = '';
  public turnos: Turno[] = [];
  public turnosMostrar: Turno[] = [];
  public especialistas: Especialista[] = [];

  ////////////////////////// CONSTRUCTOR & ONINIT //////////////////////////
  constructor(
    private auth: AuthService,
    private turnoService: TurnoService,
    private especialistaService: EspecialistaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.getUserLogged().subscribe((user) => {
      if (user) {
        this.email = user?.email!;
        this.getTurnos();
      }
    });
  }

  ////////////////////////// METODOS //////////////////////////

  /**
   * Me permitira obtener los turnos
   * y a quien se le fueron asignados.
   */
  getTurnos() {
    //-->Obtengo los turnos del paciente
    this.turnoService
      .getTurnosByEmailPaciente(this.email)
      .subscribe((turnos) => {
        this.turnos = turnos;
        this.turnosMostrar = turnos;
        for (const item of this.turnos) {
          //-->Traigo al especialista
          this.especialistaService
            .obtenerEspPorMail(item.emailEspecialista)
            .subscribe((especialista) => {
              let existe = false;
              //-->Agrego al especialista al array
              if (this.especialistas.length > 0)
                this.especialistas.push(especialista!);
              else {
                //-->Busco que exista el especialista.
                for (const especialista of this.especialistas) {
                  if (especialista.email === item.emailEspecialista) {
                    existe = true;
                    break;
                  }
                }
                if (!existe) this.especialistas.push(especialista!);
              }
            });
        }
      });
  }

  /**
   * Me permitira filtrar
   * los turnos por el input
   * que ingrese el paciente.
   * @param event
   */
  onFiltrarTurnos(event: any): void {
    const valor = event.target.value;

    if (valor === '') {
      this.turnosMostrar = this.turnos;
    } else {
      this.turnosMostrar = [];
      for (const turno of this.turnos) {
        if (
          this.contieneSubcadenaIgnoreCase(turno.estado, valor) ||
          this.contieneSubcadenaIgnoreCase(turno.fecha, valor) ||
          this.contieneSubcadenaIgnoreCase(turno.horario.hora, valor) ||
          this.contieneSubcadenaIgnoreCase(turno.especialidad, valor)
        ) {
          this.turnosMostrar.push(turno);
        } else if (turno.emailEspecialista) {
          const especialista = this.getEspecialista(turno.emailEspecialista);
          if (especialista !== null) {
            const nombreCompleto = `${especialista.nombre} ${especialista.apellido}`;
            if (this.contieneSubcadenaIgnoreCase(nombreCompleto, valor)) {
              this.turnosMostrar.push(turno);
            }
          }
        }
      }
    }
  }

  /**
   * Buscara por coincidencia
   * de email a un especialista
   * y retornara su nombre completo.
   * @param email email del
   * profesional
   * @returns el nombre completo
   */
  getEspecialista(email: string): { nombre: string; apellido: string } | null {
    for (const esp of this.especialistas) {
      if (esp.email === email) {
        return { nombre: esp.nombre, apellido: esp.apellido };
      }
    }
    return null;
  }

  /**
   * Me permitira cancelar
   * una cita por parte del paceinte.
   * @param turno el turno
   * que se debera de cancelar.
   */
  onCancelarTurno(turno: Turno): void {
    Swal.fire({
      title: '¿Desea cancelar su turno?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cancelar Turno',
      confirmButtonColor: 'darkslategray', //-->Color del boton de confirmar
      background: 'antiquewhite', //-->Color de fondo
    }).then(async (resultado) => {
      //-->Si confirmo cancelar el turno:
      if (resultado.isConfirmed) {
        //-->Debe de dejar un comentario de porque
        //cancela el turno.
        const { value: text } = await Swal.fire({
          input: 'textarea',
          inputLabel: 'Cancelar el Turno',
          inputPlaceholder: 'Ingrese la razón',
          inputAttributes: {
            'aria-label': 'Type your message here',
          },
          showCancelButton: true,
          background: 'antiquewhite', //-->Color de fondo
        });

        //-->Si ingreso el porque:
        if (text) {
          Swal.fire({
            title: 'Cancelado!',
            text: `El turno fue cancelado con exito`,
            icon: 'success',
            confirmButtonText: 'Ok.',
            confirmButtonColor: 'darkslategray', //-->Color del boton de confirmar
            background: 'antiquewhite', //-->Color de fondo
          }).then(() => {
            turno.resenia = text;
            turno.estado = 'cancelado';
            this.turnoService.updateTurno(turno); //-->Updateo el turno en firestore.
            this.getTurnos(); //-->Actualizo los turnos que traje
          });
        }
      }
    });
  }

  /**
   * Me pernmitra escribir una
   * resenia.
   * @param turno sobre
   * el cual se hace la resenia
   * @returns devuelve la resenia
   * escrita.
   */
  onGetResenia(turno: Turno): string {
    return turno.resenia;
  }

  /**
   * Me permitira ver la resenia
   * escrita (o no) por el paciente.
   * @param turno el turno
   * sobre el cual realizara la
   * resenia.
   */
  onVerResenia(turno: Turno): void {
    console.log(turno.resenia);

    if (turno.resenia) {
      Swal.fire({
        title: 'Información de la reseña.',
        text: turno.resenia,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: 'darkslategray', //-->Color del boton de confirmar
        background: 'antiquewhite', //-->Color de fondo
      });
    } else {
      Swal.fire({
        title: 'No se ha escrito una reseña todavía.',
        icon: 'info',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: 'darkslategray', //-->Color del boton de confirmar
        background: 'antiquewhite', //-->Color de fondo
      });
    }
  }

  /**
   * Metodo para que termine
   * de completar
   * la encuesta.
   */
  async onCompletarEncuesta(turno: Turno) {
    //-->Aca se mostrara un SweetAltert para que
    //cargue la encuesta.
    const { value: respuesta } = await Swal.fire({
      title: 'Encuenta sobre su Turno medico.',
      focusConfirm: false,
      preConfirm: () => {
        return [
          (document.getElementById('swal-input2') as HTMLInputElement).value,
          (document.getElementById('swal-input3') as HTMLInputElement).value,
        ];
      },
      html: `
      <label for="swal-input2">2. En una escala del 1 al 10, ¿qué tan satisfecho estás con la claridad de las explicaciones proporcionadas por nuestro personal médico sobre tu condición de salud y el plan de tratamiento?</label>
      <input id="swal-input2" class="swal2-input" type="number" min="1" max="10">

      <label for="swal-input3">3. ¿Consideras que el tiempo de demora aguardando tu turno fue excesivo?</label>
      <input id="swal-input3" class="swal2-input" type="text">
      `,
      background: 'antiquewhite', //-->Color de fondo
    });

    if (respuesta) {
      Swal.fire({
        title: 'Encuesta Finalizada!',
        text: `Gracias por completar la encuesta del servicio!`,
        icon: 'success',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: 'darkslategray', //-->Color del boton de confirmar
        background: 'antiquewhite', //-->Color de fondo
      }).then(() => {
        console.log(respuesta);
        turno.encuesta = respuesta; //-->GUardo la encuesta sobre el turno mdico
        this.turnoService.updateTurno(turno); //-->UPdateo en firestore
        this.getTurnos(); //-->Vuelvo a traer los turnos.
      });
    }
  }

  async onCalificarTurno(turno: Turno) {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Calificar Atención',
      inputPlaceholder:
        'Ingrese un comentario de como fue la atención del Especialista.',
      inputAttributes: {
        'aria-label': 'Type your message here',
      },
      showCancelButton: true,
      confirmButtonText: 'Calificar Turno.',
      confirmButtonColor: 'darkslategray', //-->Color del boton de confirmar
      background: 'antiquewhite', //-->Color de fondo
    });
    //-->Si completo;
    if (text) {
      Swal.fire({
        title: 'Calificado!',
        text: `Gracias por calificar nuestro personal`,
        icon: 'success',
        background: 'antiquewhite', //-->Color de fondo
      }).then(() => {
        turno.calificacion = text;
        this.turnoService.updateTurno(turno);
        this.getTurnos();
      });
    }
  }

  private contieneSubcadenaIgnoreCase(
    cadenaPrincipal: string,
    subcadena: string
  ): boolean {
    return cadenaPrincipal.toLowerCase().includes(subcadena.toLowerCase());
  }

  goBack() {
    this.router.navigateByUrl('paciente');
  }
}
