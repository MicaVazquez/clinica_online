export interface Jornada {
  email: string;
  dias: Dias;
  id: string;
}

export interface Dias {
  [dia: string]: Horario[];
}

export interface Horario {
  nroConsultorio: number;
  hora: Hora;
}

////////////////////////////////////////////////////////////////////////////////

export interface Cronograma {
  [consultorio: string]: DiasCronograma;
}

export interface DiasCronograma {
  [dia: string]: HorarioCronograma[];
}

export interface HorarioCronograma {
  hora: Hora;
  disponible: boolean;
}

////////////////////////////////////////////////////////////////////////////////

export interface JornadaDiaView {
  [consultorio: string]: HorarioCronograma[];
}

export type Hora =
  | '08:00'
  | '08:30'
  | '09:00'
  | '09:30'
  | '10:00'
  | '10:30'
  | '11:00'
  | '11:30'
  | '12:00'
  | '12:30'
  | '13:00'
  | '13:30'
  | '14:00'
  | '14:30'
  | '15:00'
  | '15:30'
  | '16:00'
  | '16:30'
  | '17:00'
  | '17:30'
  | '18:00'
  | '18:30';

export function esJornadaValida(jornada: Jornada): boolean {
  if (!jornada.email || typeof jornada.email !== 'string') {
    console.log('La jornada debe tener un email válido.');
    return false;
  }

  const diasValidos = [
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
  ];
  for (const dia of diasValidos) {
    if (!jornada.dias[dia] || !Array.isArray(jornada.dias[dia])) {
      console.log(`El día ${dia} debe tener una lista de horarios válida.`);
      return false;
    }

    if (!sonHorariosDistintosEnDia(jornada.dias[dia], dia)) {
      console.log(
        `Existen horarios iguales en ${dia} en distintos consultorios.`
      );
      return false;
    }
  }

  console.log('La jornada es válida.');
  return true;
}

function sonHorariosDistintosEnDia(horarios: Horario[], dia: string): boolean {
  const horariosSet = new Set<string>();

  for (const horario of horarios) {
    const claveUnica = `${horario.hora}-${dia}`;
    if (horariosSet.has(claveUnica)) {
      return false;
    }
    horariosSet.add(claveUnica);
  }

  return true;
}

export function convertirJornadaACronograma(jornada: Jornada): Cronograma {
  const cronograma: Cronograma = {};

  for (const dia in jornada.dias) {
    const horarios = jornada.dias[dia];

    for (const horario of horarios) {
      const { hora, nroConsultorio } = horario;

      if (!cronograma[`consultorio${nroConsultorio}`]) {
        cronograma[`consultorio${nroConsultorio}`] = {};
      }

      if (!cronograma[`consultorio${nroConsultorio}`][dia]) {
        cronograma[`consultorio${nroConsultorio}`][dia] = [];
      }

      cronograma[`consultorio${nroConsultorio}`][dia].push({
        hora,
        disponible: false,
      });
    }
  }

  return cronograma;
}
