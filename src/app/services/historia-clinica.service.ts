import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  onSnapshot,
} from '@angular/fire/firestore';
import { Paciente } from './paciente.service';
import { Observable } from 'rxjs';
import { HistoriaClinica } from '../interfaces/historia-clinica';

@Injectable({
  providedIn: 'root',
})
export class HistoriaClinicaService {
  constructor(private firestore: Firestore) {}

  /**
   * Me permitira agregarle al paciente
   * un nuevo historial de un turno suyo.
   * @param nuevoHistorial El nuevo historial
   * a agregar al paciente
   * @param paciente El paciente de historial
   * @returns Una promesa.
   */
  addClinicoHistorial(nuevoHistorial: any, paciente: Paciente): Promise<any> {
    if (paciente === null) return Promise.reject();

    const col = collection(
      this.firestore,
      'pacientes/' + paciente.idDoc + '/historial'
    );
    return addDoc(col, nuevoHistorial);
  }

  /**
   * Me permitira agregar un nuevo historial
   * mediante la id del paceinte.
   * @param nuevoHistorial El nuevo hisotrial
   * a agregar del paceinte
   * @param idPac el id del paciente.
   * @returns
   */
  addHistorialClinicoPorID(nuevoHistorial: any, idPac: string): Promise<any> {
    if (idPac === '') return Promise.reject();

    const col = collection(this.firestore, 'pacientes/' + idPac + '/historial');
    return addDoc(col, nuevoHistorial);
  }

  /**
   * Me permitira traerme la historia
   * clinica de un paciente especifico por ID.
   * @param idPac el id del paciente
   * @returns un observable.
   */
  traerHistorialClinicoPorID(idPac: string): Observable<HistoriaClinica[]> {
    return new Observable<HistoriaClinica[]>((observer) => {
      const col = collection(
        this.firestore,
        'pacientes/' + idPac + '/historial'
      );
      onSnapshot(
        col,
        (snap) => {
          const historial: HistoriaClinica[] = [];
          snap.forEach((doc) => {
            const data = doc.data() as HistoriaClinica;
            historial.push(data);
          });
          observer.next(historial); // Enviar los datos obtenidos
        },
        (error) => {
          observer.error(error); // Enviar error si ocurre
        }
      );
    });
  }

  /**
   * Me permitira traerme todos los
   * historiales clinicos de todos
   * los pacientes dentro de la clinica.
   */
  traerHistorialesClinicos(): Observable<HistoriaClinica[]> {
    return new Observable<HistoriaClinica[]>((observer) => {
      onSnapshot(collection(this.firestore, 'pacientes'), (snap) => {
        const pacientes: Paciente[] = [];
        snap.forEach((doc) => {
          const uno = doc.data() as Paciente;
          pacientes.push(uno);
        });

        const historiales: HistoriaClinica[] = [];
        pacientes.forEach((paciente) => {
          onSnapshot(
            collection(
              this.firestore,
              'pacientes/' + paciente.idDoc + '/historial'
            ),
            (snap) => {
              snap.docChanges().forEach((x) => {
                const data = x.doc.data() as HistoriaClinica;
                historiales.push(data);
              });
            }
          );
        });
        observer.next(historiales);
      });
    });
  }
}
