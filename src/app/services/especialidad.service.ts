import { Injectable } from '@angular/core';
import { Especialidad } from '../interfaces/especialidad';
import { Observable } from 'rxjs';
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
  traer(): Observable<Especialidad[]> {
    const q = query(collection(this.firestore, 'especialidades'));
    return new Observable<Especialidad[]>((observer) => {
      onSnapshot(q, (snapshot) => {
        const especialidades: Especialidad[] = [];
        snapshot.docChanges().forEach((change) => {
          const one = change.doc.data() as Especialidad;
          especialidades.push(one);
        });
        observer.next(especialidades);
      });
    });
  }
}
