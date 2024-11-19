import { Injectable } from '@angular/core';

import {
  ListResult,
  Storage,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {}

  subirImg(file: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const imgRef = ref(this.storage, `usuarios/${Date.now()}-${file.name}`);
      uploadBytes(imgRef, file)
        .then((res) => getDownloadURL(imgRef))
        .then((url) => {
          console.log('Subida', file);
          resolve(url);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  subirImg2(file: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      // Crear una referencia en Firebase Storage para la carpeta "imagenes"
      const imgRef = ref(this.storage, `imagenes/${Date.now()}-${file.name}`);

      // Subir el archivo
      uploadBytes(imgRef, file)
        .then(() => {
          // Una vez que el archivo se suba, obtenemos la URL pública
          return getDownloadURL(imgRef);
        })
        .then((url) => {
          console.log('Imagen subida con éxito:', file);
          resolve(url); // Retorna la URL de la imagen subida
        })
        .catch((error) => {
          console.error('Error al subir la imagen:', error);
          reject('Error al subir la imagen');
        });
    });
  }
}
