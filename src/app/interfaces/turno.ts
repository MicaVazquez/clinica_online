import { Horario } from './jornada';

export interface Turno {
  //-->Sobre el turno en si
  horario: Horario;
  id: string;
  fecha: string;
  emailPaciente: string;
  emailEspecialista: string;
  especialidad: string;
  estado: string;

  //-->Encuesta
  calificacion: string;
  encuesta: string[];
  resenia: string;

  //-->Historial
  historialClinico: boolean; //--->Para saber si tiene un historioal
}

export interface DiaAtencion {
  fecha: string;
  dia: string;
  horarios: HorarioAtencion[];
}

export interface HorarioAtencion {
  horario: Horario;
  especialistaEmail: string;
  disponible: boolean;
}
