import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  getDocs,
} from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { DatabaseService } from './database.service';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuario';
import { Admin } from '../interfaces/admin';
import { Paciente, PacienteService } from './paciente.service';
import { Especialista } from '../interfaces/especialista';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';
import { EspecialistaService } from './especialista.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private dataSrv: DatabaseService,
    private authAngFire: Auth,
    private router: Router,
    private firestore: Firestore,
    private adminService: AdminService,
    private especialistaSrv: EspecialistaService,
    private pacienteSrv: PacienteService
  ) {}

  async register(user: Usuario) {
    try {
      const credential = await createUserWithEmailAndPassword(
        this.authAngFire,
        user.email,
        user.clave
      );
      if (credential) {
        console.log('Credential: ', credential);

        const currentUser = this.authAngFire.currentUser;
        if (currentUser) {
          await sendEmailVerification(currentUser);
          console.log('Registrado. Email de verificación enviado.');
          return credential.user;
        } else {
          console.error(
            'Error: Usuario actual no disponible para enviar verificación.'
          );
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      let msj = this.parsearError(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: msj,
      });
      return null;
    }
  }

  private parsearError(error: any) {
    let msj: string = '';
    switch (error.code) {
      case 'auth/invalid-email':
        msj = 'Email no valido!';
        break;
      case 'auth/email-already-in-use':
        msj = 'Email ya registrado!';
        break;
      case 'auth/weak-password':
        msj = 'La contraseña debe ser mayor a 6 caracteres!';
        break;
      default:
        msj = 'Error inesperado al intentar registrarse!';
        break;
    }
    return msj;
  }

  logout() {
    this.afAuth.signOut();
  }

  async login(user: Usuario) {
    try {
      return await this.afAuth.signInWithEmailAndPassword(
        user.email,
        user.clave
      );
    } catch (error) {
      console.log('Error signing in');
      return null;
    }
  }

  async registerAdmin(user: Usuario) {
    try {
      return await this.afAuth
        .createUserWithEmailAndPassword(user.email, user.clave)
        .then((res) => {
          console.log('Admin registrado');
          return true;
        });
    } catch (error) {
      return false;
    }
  }

  getUserLogged() {
    return this.afAuth.authState;
  }

  getUser() {
    return this.afAuth.currentUser;
  }

  async loginWithAuth(email: string, password: string) {
    try {
      //-->Obtengo cuando se logueo en la app
      const loginTime = new Date();
      // const fecha = Date.now();
      //-->Guardo el log del  inicio de sesion a Firebase
      await addDoc(collection(this.firestore, 'logs'), {
        email: email,
        loginTime: loginTime.toString(),
        // fecha: fecha
      });

      return await signInWithEmailAndPassword(
        this.authAngFire,
        email,
        password
      );
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return null;
    }
  }

  esAdmin(email: string): Observable<Admin | null> {
    return new Observable<Admin | null>((observer) => {
      this.adminService.traer().subscribe((admins) => {
        for (const admin of admins) {
          if (admin.email === email) {
            observer.next(admin);
            observer.complete();
            return; // Exit the loop after finding a match
          }
        }
        observer.next(null); // No matching admin found
        observer.complete();
      });
    });
  }

  esPaciente(email: string): Observable<Paciente | null> {
    return new Observable<Paciente | null>((observer) => {
      this.pacienteSrv.traer().subscribe((pacientes) => {
        pacientes.forEach((paciente) => {
          if (paciente.email === email) {
            observer.next(paciente);
            observer.complete();
          }
        });
        observer.next(null);
        observer.complete();
      });
    });
  }

  esEspecialista(email: string): Observable<Especialista | null> {
    return new Observable<Especialista | null>((observer) => {
      this.especialistaSrv.traer().subscribe((especialista) => {
        especialista.forEach((especialista) => {
          if (especialista.email === email) {
            observer.next(especialista);
            observer.complete();
          }
        });
        observer.next(null);
        observer.complete();
      });
    });
  }
}
