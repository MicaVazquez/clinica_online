import { Component } from '@angular/core';
import { CurrentUserService } from '../../../services/current-user.service';
import { AuthService } from '../../../services/auth.service';
import { CronogramaService } from '../../../services/cronograma.service';
import { JornadaService } from '../../../services/jornada.service';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import Swal from 'sweetalert2';
import {
  Jornada,
  Dias,
  Cronograma,
  JornadaDiaView,
  Horario,
  HorarioCronograma,
  esJornadaValida,
  armarCronograma,
} from '../../../interfaces/jornada';

import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-horarios',
  standalone: true,
  imports: [NgClass, NgIf, NgFor, FormsModule, MatIcon, MatButton],
  templateUrl: './mis-horarios.component.html',
  styleUrl: './mis-horarios.component.css',
})
export class MisHorariosComponent {
  public accion: string = '';
  public cronograma!: Cronograma;
  public email: string = '';
  public lunes!: JornadaDiaView;
  public martes!: JornadaDiaView;
  public miercoles!: JornadaDiaView;
  public jueves!: JornadaDiaView;
  public viernes!: JornadaDiaView;
  public sabado!: JornadaDiaView;
  public lunesConsultorio: string = 'consultorio1';
  public martesConsultorio: string = 'consultorio1';
  public miercolesConsultorio: string = 'consultorio1';
  public juevesConsultorio: string = 'consultorio1';
  public viernesConsultorio: string = 'consultorio1';
  public sabadoConsultorio: string = 'consultorio1';
  public jornadaEsp!: Jornada;
  public diasEsp!: Dias;
  public lunesHorario!: Horario[];
  public martesHorario!: Horario[];
  public miercolesHorario!: Horario[];
  public juevesHorario!: Horario[];
  public viernesHorario!: Horario[];
  public sabadoHorario!: Horario[];
  public jornadaVieja!: Jornada;

  ////////////////////////////////// CTOR & ONINIT //////////////////////////////////
  constructor(
    private cUser: CurrentUserService,
    private jor: JornadaService,
    private auth: AuthService,
    private crono: CronogramaService,
    private router: Router
  ) {}

  /**
   * En el oninit me traigo
   * la accion, el cronograma, las jornadas
   * y filtro aquellos dias ya tomados.
   */
  ngOnInit(): void {
    this.accion = this.cUser.accionHorarios;
    this.auth.getUserLogged().subscribe((res) => {
      if (res) {
        this.email = res!.email as string;
        this.jor.traerJornada(this.email).subscribe((data) => {
          this.jornadaVieja = data;
          console.log('JORNADA TRAIDA EN EL ONINIT: ', this.jornadaVieja);

          if (this.accion == 'agregar') {
            this.crono.traerCronograma().subscribe((res) => {
              this.lunes = this.crono.getHorario(res, 'lunes');
              this.martes = this.crono.getHorario(res, 'martes');
              this.miercoles = this.crono.getHorario(res, 'miercoles');
              this.jueves = this.crono.getHorario(res, 'jueves');
              this.viernes = this.crono.getHorario(res, 'viernes');
              this.sabado = this.crono.getHorario(res, 'sabado');

              this.filtrarTomados();
              this.cronograma = res;
            });
          } else if (this.accion == 'editar') {
            this.lunesHorario = this.jornadaVieja.dias['lunes'];
            this.martesHorario = this.jornadaVieja.dias['martes'];
            this.miercolesHorario = this.jornadaVieja.dias['miercoles'];
            this.juevesHorario = this.jornadaVieja.dias['jueves'];
            this.viernesHorario = this.jornadaVieja.dias['viernes'];
            this.sabadoHorario = this.jornadaVieja.dias['sabado'];
          }
        });
      }
    });
  }

  toggleActive(hora: HorarioCronograma) {
    hora.disponible = !hora.disponible;
  }

  private filtrarTomados() {
    this.lunes = this.filtrar(this.lunes);
    this.martes = this.filtrar(this.martes);
    this.miercoles = this.filtrar(this.miercoles);
    this.jueves = this.filtrar(this.jueves);
    this.viernes = this.filtrar(this.viernes);
    this.sabado = this.filtrar(this.sabado);
  }

  private filtrar(dia: JornadaDiaView) {
    const nuevo = {} as JornadaDiaView;

    for (const consultorio in dia) {
      nuevo[consultorio] = dia[consultorio].filter(
        (hora: HorarioCronograma) => hora.disponible
      );
    }

    return nuevo;
  }

  /**
   * Boton guardar.
   */
  guardar() {
    //-->Horarios vacios
    this.lunesHorario = [];
    this.martesHorario = [];
    this.miercolesHorario = [];
    this.juevesHorario = [];
    this.viernesHorario = [];
    this.sabadoHorario = [];

    //--->Voy a generar las jornadas de los dias con los horarios
    this.generarJornada(this.lunes, this.lunesHorario);
    this.generarJornada(this.martes, this.martesHorario);
    this.generarJornada(this.miercoles, this.miercolesHorario);
    this.generarJornada(this.jueves, this.juevesHorario);
    this.generarJornada(this.viernes, this.viernesHorario);
    this.generarJornada(this.sabado, this.sabadoHorario);

    //-->Le asig no al especialista sus dias.
    this.diasEsp = {
      lunes: this.lunesHorario,
      martes: this.martesHorario,
      miercoles: this.miercolesHorario,
      jueves: this.juevesHorario,
      viernes: this.viernesHorario,
      sabado: this.sabadoHorario,
    };

    //-->Hago la jornada de este,
    this.jornadaEsp = {
      email: this.email,
      dias: this.diasEsp,
      id: '',
    };

    //-->Valido que sea una jornada correcta
    if (esJornadaValida(this.jornadaEsp)) {
      //-->Armo y actualizo el cronograma.
      const crono = armarCronograma(this.jornadaEsp);
      const actCrono = this.crono.actualizarCronograma(this.cronograma, crono);

      this.crono.updateCronograma(actCrono);

      //-->Si la jornada vieja es correcta: actaulizo los valores
      if (this.jornadaVieja) {
        console.log('Jornada vieja ID: ', this.jornadaVieja.id);

        this.jornadaEsp.id = this.jornadaVieja.id;
        this.jornadaEsp.email = this.jornadaVieja.email;

        for (const dia in this.jornadaVieja.dias) {
          for (const horarios of this.jornadaVieja.dias[dia]) {
            this.jornadaEsp.dias[dia] =
              this.jornadaEsp.dias[dia].concat(horarios);
            this.ordenarPorHora(this.jornadaEsp.dias[dia]);
          }
        }
        console.log('Jornada ACTUALIZADA: ', this.jornadaEsp);
        this.jor.updateJornada(this.jornadaEsp);
        Swal.fire({
          icon: 'success',
          title: 'Jornada actualizada',
          text: 'Su jornada ha sido actualizada correctamente.',
        });
      } else {
        //-->Sino, le asigno nueva jornada.
        console.log('JORNADA TOTALMENTE NUEVA; ', this.jornadaEsp);
        this.jor.addJornada(this.jornadaEsp);
        Swal.fire({
          icon: 'success',
          title: 'Jornada cargada',
          text: 'Su jornada se ha cargado correctamente.',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Horarios invalidos',
        footer: 'Verifique que no tenga en un dia horarios repetidos',
      });
    }
  }

  /**
   * Podre generar una jornada, con su dia,
   * horario, consultorio.
   * @param dia
   * @param horario
   */
  generarJornada(dia: JornadaDiaView, horario: Horario[]) {
    for (const consult in dia) {
      for (const hora in dia[consult]) {
        if (!dia[consult][hora]['disponible']) {
          horario.push({
            hora: dia[consult][hora]['hora'],
            nroConsultorio: parseInt(consult[consult.length - 1]),
          });
        }
      }
    }
  }

  /**
   * Me permitira ordenar los horarios.
   * @param horarios un array de horarios
   */
  private ordenarPorHora(horarios: Horario[]) {
    horarios.sort((a: Horario, b: Horario) => {
      //-->Convertir las horas a objetos Date para comparar
      const horaA = new Date(`1970-01-01T${a.hora}`);
      const horaB = new Date(`1970-01-01T${b.hora}`);

      //-->Comparar las horas
      return horaA.getTime() - horaB.getTime();
    });
  }

  goTo() {
    this.router.navigateByUrl('especialista/mi-perfil');
  }
}
