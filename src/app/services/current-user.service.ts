import { Injectable } from '@angular/core';
import { Especialista } from '../interfaces/especialista';
import { Paciente } from './paciente.service';
import { Admin } from '../interfaces/admin';
import { Usuario } from '../interfaces/usuario';
import { Turno } from '../interfaces/turno';
@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  public especialista!: Especialista;
  public paciente!: Paciente;
  public accionHorarios!: string;
  public admin!: Admin;
  public idPacienteHistorial!: string;
  public turno!: Turno;

  public currentUser: Usuario = {
    email: '',
    clave: '',
  };
  constructor() {}
}
