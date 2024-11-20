import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Paciente {
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  obraSocial: string;
  email: string;
  img1: string;
  img2: string;
  idDoc: string;
}
@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private dataRef;

  constructor(private firestore: Firestore) {
    this.dataRef = collection(this.firestore, 'pacientes');
  }

  addPaciente(nuevoPaciente: Paciente): Promise<any> {
    if (nuevoPaciente === null) return Promise.reject();
    const docs = doc(this.dataRef);
    nuevoPaciente.idDoc = docs.id;
    return setDoc(docs, nuevoPaciente);
  }
  traer(): Observable<Paciente[]> {
    const q = query(collection(this.firestore, 'pacientes'));
    return new Observable<Paciente[]>((observer) => {
      onSnapshot(q, (snapshot) => {
        const pacientes: Paciente[] = [];
        snapshot.docChanges().forEach((change) => {
          const one = change.doc.data() as Paciente;
          pacientes.push(one);
        });
        observer.next(pacientes);
      });
    });
  }
  async obtener(ruta: string) {
    let array: any[] = [];
    const querySnapshot = await getDocs(collection(this.firestore, ruta));
    querySnapshot.forEach((doc) => {
      let data = {
        id: doc.id,
        data: doc.data(),
      };
      array.push(data);
    });
    return array;
  }
  traerPacientePorId(idPac: string): Observable<Paciente> {
    return new Observable<Paciente>((observer) => {
      onSnapshot(this.dataRef, (snap) => {
        snap.docChanges().forEach((x) => {
          const data = x.doc.data() as Paciente;
          if (data.idDoc === idPac) {
            observer.next(data);
          }
        });
      });
    });
  }
}
