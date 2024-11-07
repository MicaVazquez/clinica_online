import { Usuario } from './usuario';

export interface Paciente extends Usuario {
  obra_social: string;
}
