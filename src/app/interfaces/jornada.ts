/**
 * Para saber que jornada cumple
 * una persona.
 */
export interface Jornada {
  email: string; //--> Email de la persona
  dias: Dias; //--> Sus dias
  id: string; //--> Identificador
}

export interface JornadaDiaView {
  [consultorio: string]: HorarioCronograma[];
}

/**
 * Dias con un array
 * de horarios
 */
export interface Dias {
  [dia: string]: Horario[];
}

/**
 * Horarios con el numero
 * del consultorio
 */
export interface Horario {
  nroConsultorio: number;
  hora: Hora;
}

/**
 * Contendra los horarios
 * disponibles para la atencion
 * de las consultas.
 */
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
  | '18:30'
  | '19:00'
  | '19:30'
  | '20:00';

/**
 * Para manejar si el horario
 * esta disponible o no.
 */
export interface HorarioCronograma {
  hora: Hora;
  disponible: boolean;
}

/**
 * Constiene el dia y los horarios
 * disponibles.
 */
export interface DiasCronogramaa {
  [dia: string]: HorarioCronograma[];
}

/**
 * Controla logica de horarios.
 */
export interface Cronograma {
  [consultorio: string]: DiasCronogramaa;
}

/////////////////////////////// METODOS ///////////////////////////////

export function esJornadaValida(jornada: Jornada): boolean {
  if (!jornada.email || typeof jornada.email !== 'string') {
    console.log('Jornada de mail invalido');
    return false;
  }

  //--> Dias validos de atencion d la clinica
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

export function sonHorariosDistintosEnDia(
  horarios: Horario[],
  dia: string
): boolean {
  const horariosSet = new Set<string>();

  //--> Recorro los horarios para verificar que no haya
  //coincidencia de dia y horario, con una clave unica
  //que se le asigna.
  for (const horario of horarios) {
    const claveUnica = `${horario.hora}-${dia}`;
    if (horariosSet.has(claveUnica)) {
      return false;
    }
    horariosSet.add(claveUnica);
  }

  return true;
}

export function armarCronograma(jornada: Jornada): Cronograma {
  const cronograma: Cronograma = {};
  //-->Me fijo si el dia esta en la jornada
  for (const dia in jornada.dias) {
    const horarios = jornada.dias[dia];

    //--> Recorro los horario
    for (const horario of horarios) {
      //-->Hora y consultorio hacen un horario.
      const { hora, nroConsultorio } = horario;

      //-->Si aun no existe en cronograma lo inicializo
      if (!cronograma[`consultorio${nroConsultorio}`]) {
        cronograma[`consultorio${nroConsultorio}`] = {};
      }

      //-->Si el DIA aun no existe lo inicializo
      if (!cronograma[`consultorio${nroConsultorio}`][dia]) {
        cronograma[`consultorio${nroConsultorio}`][dia] = [];
      }

      //-->
      cronograma[`consultorio${nroConsultorio}`][dia].push({
        hora,
        disponible: false,
      });
    }
  }
  return cronograma;
}
