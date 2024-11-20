export interface DatoDinamico {
  [clave: string]: string;
}

export interface HistoriaClinica {
  altura: string;
  peso: string;
  temperatura: string;
  presion: string;
  datos: DatoDinamico[]; //-->Datos dinamicos
  emailEspecialista: string;
  emailPaciente: string;
  especialidad: string;
}
