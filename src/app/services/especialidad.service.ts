import { Injectable } from '@angular/core';
import { Especialidad } from '../interfaces/especialidad';
import {
  Firestore,
  addDoc,
  collection,
  onSnapshot,
  query,
} from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class EspecialidadService {
  private dataRef;

  constructor(private firestore: Firestore) {
    this.dataRef = collection(this.firestore, 'especialidades');
  }

  agregarEspecialidad(nuevaEspecialidad: Especialidad): void {
    if (nuevaEspecialidad === null) return;
    addDoc(this.dataRef, nuevaEspecialidad);
  }

  obtenerEspecialidades(listaEspecialidades: Especialidad[]) {
    const q = query(this.dataRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          listaEspecialidades.push(change.doc.data() as Especialidad);
        }
      });
    });
    return unsubscribe;
  }
}
