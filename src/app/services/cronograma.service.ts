import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Cronograma, JornadaDiaView } from '../interfaces/jornada';
@Injectable({
  providedIn: 'root',
})
export class CronogramaService {
  private cronogramaRef;

  constructor(private firestore: Firestore) {
    this.cronogramaRef = collection(this.firestore, 'cronograma');
  }

  /**
   * Lo instanciare por primera vez
   * para generar el cronograma de la
   * jornada de turnos.
   */
  generarJornadaInicial() {
    //-->Horarios disponibles
    const horarios = [
      {
        hora: '08:00',
        disponible: true,
      },
      {
        hora: '08:30',
        disponible: true,
      },
      {
        hora: '09:00',
        disponible: true,
      },
      {
        hora: '09:30',
        disponible: true,
      },
      {
        hora: '10:00',
        disponible: true,
      },
      {
        hora: '10:30',
        disponible: true,
      },
      {
        hora: '11:00',
        disponible: true,
      },
      {
        hora: '11:30',
        disponible: true,
      },
      {
        hora: '12:00',
        disponible: true,
      },
      {
        hora: '12:30',
        disponible: true,
      },
      {
        hora: '13:00',
        disponible: true,
      },
      {
        hora: '13:30',
        disponible: true,
      },
      {
        hora: '14:00',
        disponible: true,
      },
      {
        hora: '14:30',
        disponible: true,
      },
      {
        hora: '15:00',
        disponible: true,
      },
      {
        hora: '15:30',
        disponible: true,
      },
      {
        hora: '16:00',
        disponible: true,
      },
      {
        hora: '16:30',
        disponible: true,
      },
      {
        hora: '17:00',
        disponible: true,
      },
      {
        hora: '17:30',
        disponible: true,
      },
      {
        hora: '18:00',
        disponible: true,
      },
      {
        hora: '18:30',
        disponible: true,
      },
      {
        hora: '19:00',
        disponible: true,
      },
      {
        hora: '19:30',
        disponible: true,
      },
      {
        hora: '20:00',
        disponible: true,
      },
    ];

    //-->Horarios disponibles para el dia sabado
    const horariosSabado = [
      {
        hora: '08:00',
        disponible: true,
      },
      {
        hora: '08:30',
        disponible: true,
      },
      {
        hora: '09:00',
        disponible: true,
      },
      {
        hora: '09:30',
        disponible: true,
      },
      {
        hora: '10:00',
        disponible: true,
      },
      {
        hora: '10:30',
        disponible: true,
      },
      {
        hora: '11:00',
        disponible: true,
      },
      {
        hora: '11:30',
        disponible: true,
      },
      {
        hora: '12:00',
        disponible: true,
      },
      {
        hora: '12:30',
        disponible: true,
      },
      {
        hora: '13:00',
        disponible: true,
      },
      {
        hora: '13:30',
        disponible: true,
      },
      {
        hora: '14:00',
        disponible: true,
      },
      {
        hora: '14:30',
        disponible: true,
      },
    ];

    //--> A los dias se les asigna horarios
    const dias = {
      lunes: horarios,
      martes: horarios,
      miercoles: horarios,
      jueves: horarios,
      viernes: horarios,
      sabado: horariosSabado,
    };

    //--> A los consultorios les asigno dias y horarios.
    const cronograma = {
      consultorio1: dias,
      consultorio2: dias,
      consultorio3: dias,
      consultorio4: dias,
      consultorio5: dias,
      consultorio6: dias,
    };
    addDoc(this.cronogramaRef, cronograma);
  }

  /**
   * Me permitira traer el cronograma
   * de horarios de turnos.
   * @returns
   */
  traerCronograma(): Observable<Cronograma> {
    return new Observable<Cronograma>((observer) => {
      onSnapshot(this.cronogramaRef, (snap) => {
        snap.docChanges().forEach((x) => {
          const crono = x.doc.data();
          observer.next(crono);
        });
      });
    });
  }

  /**
   * Me permitira traer un dia.
   * @param crono
   * @param dia
   * @returns
   */
  getHorario(crono: Cronograma, dia: string) {
    const horarios = {} as JornadaDiaView;
    for (const consultorio in crono) {
      horarios[consultorio] = crono[consultorio][dia];
    }
    return horarios;
  }

  /**
   * Me permitira actualizar una jornada laboral.
   * @param nuevoCrono
   * @returns
   */
  updateCronograma(nuevoCrono: Cronograma): void {
    if (nuevoCrono === null) return;
    const docs = doc(this.cronogramaRef, 'YwiOOESPlhdGSS1EiWN2');
    updateDoc(docs, nuevoCrono);
  }

  /**
   * Realizando todas las validaciones pertinentes
   * entre horarios, dias y consultorios
   * me permitira actualizar el cronograma.
   * @param cronograma
   * @param datosNuevos
   * @returns
   */
  actualizarCronograma(
    cronograma: Cronograma,
    datosNuevos: Cronograma
  ): Cronograma {
    const cronogramaNuevo: Cronograma = { ...cronograma };

    for (const consultorio in datosNuevos) {
      if (datosNuevos.hasOwnProperty(consultorio)) {
        if (!cronogramaNuevo[consultorio]) {
          cronogramaNuevo[consultorio] = {};
        }

        const diasCronograma = datosNuevos[consultorio];
        for (const dia in diasCronograma) {
          if (diasCronograma.hasOwnProperty(dia)) {
            const horariosCronograma = diasCronograma[dia];
            if (!cronogramaNuevo[consultorio][dia]) {
              cronogramaNuevo[consultorio][dia] = [];
            }

            for (const horarioNuevo of horariosCronograma) {
              const indice = cronogramaNuevo[consultorio][dia].findIndex(
                (horarioExistente) =>
                  horarioExistente.hora === horarioNuevo.hora
              );

              if (indice !== -1) {
                cronogramaNuevo[consultorio][dia][indice].disponible =
                  horarioNuevo.disponible;
              } else {
                cronogramaNuevo[consultorio][dia].push({
                  hora: horarioNuevo.hora,
                  disponible: horarioNuevo.disponible,
                });
              }
            }
          }
        }
      }
    }
    return cronogramaNuevo;
  }
}
