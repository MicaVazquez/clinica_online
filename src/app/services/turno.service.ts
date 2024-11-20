import { Injectable } from '@angular/core';
import { Firestore, doc, onSnapshot, setDoc } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Turno } from '../interfaces/turno';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private turnosRef;

  constructor(private firestore: Firestore) {
    this.turnosRef = collection(this.firestore, 'turnos');
  }

  /**
   * Me permitira guardar un turno
   * nuevo en la coleccion de firestore.
   * @param nuevoTurno El nuevo turno
   * a guardar.
   * @returns
   */
  addTurno(nuevoTurno: Turno): void {
    if (nuevoTurno === null) return;
    const docs = doc(this.turnosRef);
    nuevoTurno.id = docs.id; //-->le paso el id de la collec
    setDoc(docs, nuevoTurno);
  }

  /**
   * Me permitira modificar
   * un turno ya generado.
   * @param turno el turno que
   * se modificara.
   * @returns
   */
  updateTurno(turno: Turno): void {
    if (turno === null) return;
    const docs = doc(this.turnosRef, turno.id);
    setDoc(docs, {
      estado: turno.estado,
      resenia: turno.resenia ? turno.resenia : '',
      calificacion: turno.calificacion ? turno.calificacion : '',
      encuesta: turno.encuesta,
      emailEspecialista: turno.emailEspecialista,
      emailPaciente: turno.emailPaciente,
      especialidad: turno.especialidad,
      horario: turno.horario,
      id: turno.id,
      fecha: turno.fecha,
      historialClinico: turno.historialClinico ? turno.historialClinico : false, //??? porquer lo tenia como historial
    });
  }

  /**
   * Me permitira traerme todos los turnos
   * generados.
   * @returns Un observable con todos los
   * turnos.
   */
  traerTurnos(): Observable<Turno[]> {
    return new Observable<Turno[]>((observer) => {
      onSnapshot(this.turnosRef, (snap) => {
        const turnos: Turno[] = [];
        snap.docChanges().forEach((x) => {
          const data = x.doc.data() as Turno;
          turnos.push(data);
        });
        observer.next(turnos);
      });
    });
  }

  /**
   * Me permitira obtener turnos
   * del paciente que recibo por
   * email.
   * @param email El email del
   * paciente.
   * @returns los turnos de ese
   * paciente.
   */
  getTurnosByEmailPaciente(email: string): Observable<Turno[]> {
    return new Observable<Turno[]>((observer) => {
      console.log('Fetching turnos for email:', email);
      onSnapshot(this.turnosRef, (snap) => {
        const turnos: Turno[] = [];
        snap.docChanges().forEach((change) => {
          if (change.type === 'added' || change.type === 'modified') {
            const data = change.doc.data() as Turno;
            console.log('Turno data:', data);
            if (data.emailPaciente === email) {
              turnos.push(data);
            }
          }
        });
        console.log('Turnos found:', turnos);
        observer.next(turnos);
        observer.complete();
      });
    });
  }

  /**
   * Me permitira obtener los
   * turnos asignados a un especialista
   * en especifico.
   * @param email el email
   * del especialista
   * @returns retorna un obteservable
   * con los turnos
   */
  getTurnosByEmailEspecialista(email: string): Observable<Turno[]> {
    return new Observable<Turno[]>((observer) => {
      onSnapshot(this.turnosRef, (snap) => {
        const turnos: Turno[] = [];
        snap.docChanges().forEach((x) => {
          const data = x.doc.data() as Turno;
          if (data.emailEspecialista === email) turnos.push(data);
        });
        observer.next(turnos);
      });
    });
  }
}
