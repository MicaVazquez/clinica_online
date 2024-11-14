import { Injectable } from '@angular/core';
import { Jornada } from '../interfaces/jornada';
import { collection, onSnapshot } from 'firebase/firestore';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JornadaService {
  public jornada!: Jornada;

  private especialisJorRef;

  constructor(private firestore: Firestore) {
    this.especialisJorRef = collection(this.firestore, 'jornada-especialista');
  }

  /**
   * Me permitira agregar una
   * nueva jornada a la coleccion
   * de firestore.
   * @param nuevaJornada
   * @returns
   */
  addJornada(nuevaJornada: Jornada): void {
    if (nuevaJornada === null) return;
    const docs = doc(this.especialisJorRef);
    nuevaJornada.id = docs.id;
    console.log('Jornada en addJornada: ', nuevaJornada);

    setDoc(docs, nuevaJornada);
  }

  /**
   * Me permitira actualizar una
   * jornada mediante su id,
   * actualizando los dias.
   * @param jornada
   * @returns
   */
  updateJornada(jornada: Jornada): void {
    if (jornada === null) {
      console.error('No se puede actualizar la jornada: ID no válido');
      return;
    }

    const docs = doc(this.especialisJorRef, jornada.id);
    setDoc(docs, { dias: jornada.dias, email: jornada.email, id: jornada.id });
  }

  /**
   * Me permitira traer una jornada
   * de un especialista mediante
   * la coincidencia de emails.
   * @param email email del profesional
   * @returns
   */
  traerJornada(email: string): Observable<Jornada> {
    return new Observable<Jornada>((observer) => {
      onSnapshot(this.especialisJorRef, (snap) => {
        let jornada!: Jornada;
        snap.docChanges().forEach((x) => {
          const data = x.doc.data() as Jornada;
          if (data.email === email) {
            console.log('DATA DE FIRESTORE: ', data);
            jornada = data;
            return;
          }
        });
        observer.next(jornada);
      });
    });
  }

  /**
   * Me permitira traerme TODAS
   * las jornadas, sin importar
   * el especialista.
   * @returns
   */
  traerTodasLasJornadas(): Observable<Jornada[]> {
    return new Observable<Jornada[]>((observer) => {
      onSnapshot(this.especialisJorRef, (snap) => {
        const jornadas: Jornada[] = [];
        snap.docChanges().forEach((x) => {
          const data = x.doc.data() as Jornada;
          jornadas.push(data);
        });
        observer.next(jornadas);
      });
    });
  }
}
