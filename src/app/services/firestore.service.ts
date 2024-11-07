import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  guardar(data: any, ruta: string) {
    const colRef = this.firestore.collection(ruta);
    return colRef.add(data);
  }

  async modificar(data: any, ruta: string): Promise<boolean> {
    let retorno = false;
    try {
      const docRef = this.firestore.collection(ruta).doc(data.id);
      await docRef.update(data.data);
      retorno = true;
    } catch (error) {
      console.error('Error al actualizar el documento:', error);
    }
    return retorno;
  }

  async obtener(ruta: string): Promise<any[]> {
    const array: any[] = [];
    const querySnapshot = await this.firestore
      .collection(ruta)
      .get()
      .toPromise();
    querySnapshot?.forEach((doc) => {
      array.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    return array;
  }

  escucharCambios(ruta: string, callback: (data: any[]) => void) {
    this.firestore
      .collection(ruta)
      .snapshotChanges()
      .subscribe((querySnapshot) => {
        const datos = querySnapshot.map((doc) => ({
          id: doc.payload.doc.id,
          data: doc.payload.doc.data(),
        }));
        callback(datos);
      });
  }
}
