import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  getDocs,
} from '@angular/fire/firestore';
import { Especialista } from '../interfaces/especialista';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class EspecialistaService {
  private dataRef;

  constructor(private firestore: Firestore) {
    this.dataRef = collection(this.firestore, 'especialistas');
  }

  agregarEspecialista(nuevoEspecialista: Especialista): Promise<any> {
    if (nuevoEspecialista === null) return Promise.reject();
    const docs = doc(this.dataRef);
    nuevoEspecialista.idDoc = docs.id;
    return setDoc(docs, nuevoEspecialista);
  }

  traer(): Observable<Especialista[]> {
    const q = query(collection(this.firestore, 'especialistas'));
    return new Observable<Especialista[]>((observer) => {
      onSnapshot(q, (snapshot) => {
        const especialistas: Especialista[] = [];
        snapshot.docChanges().forEach((change) => {
          const one = change.doc.data() as Especialista;
          especialistas.push(one);
        });
        observer.next(especialistas);
      });
    });
  }
  obtenerEspPorMail(email: string): Observable<Especialista | undefined> {
    return new Observable<Especialista | undefined>((obs) => {
      this.traer().subscribe((lista) => {
        obs.next(lista.find((e) => e.email === email));
        obs.complete();
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
}
