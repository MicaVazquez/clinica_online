import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  getDoc,
  orderBy,
  Query,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private firestore: Firestore) {}

  async subirDoc(
    coleccion: string,
    data: any,
    docId?: string
  ): Promise<string> {
    const col = collection(this.firestore, coleccion);
    const nuevoDoc = doc(col, docId);

    try {
      await setDoc(nuevoDoc, { ...data });
    } catch (error) {
      await deleteDoc(nuevoDoc);
      throw error;
    }

    return nuevoDoc.id;
  }

  async traerDoc<T>(coleccion: string, docId: string): Promise<T> {
    const docRef = doc(this.firestore, coleccion, docId);

    const data = (await getDoc(docRef)).data();
    return data as T;
  }

  async getUsuarioData(uid: string) {
    const colRef = collection(this.firestore, 'usuarios');
    const q = query(colRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return doc.data();
    } else {
      throw new Error('Usuario no encontrado');
    }
  }

  async traerColeccion<T>(
    coleccion: string,
    ordenarPorCampo?: string
  ): Promise<Array<T>> {
    const col = collection(this.firestore, coleccion);

    let q: Query;
    if (ordenarPorCampo) q = query(col, orderBy(ordenarPorCampo));
    else q = query(col);

    const querySnapshot = await getDocs(q);
    const arrAux: Array<T> = [];

    querySnapshot.forEach((doc) => {
      arrAux.push(doc.data() as T);
    });

    return arrAux;
  }

  async actualizarDoc(coleccion: string, docId: string, data: any) {
    const docRef = doc(this.firestore, coleccion, docId);

    try {
      await updateDoc(docRef, data);
      console.log('Documento actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando documento:', error);
      throw error;
    }
  }
}
