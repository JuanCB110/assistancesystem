export interface AsistenciaChecador {
  id?: number;
  horario_id?: number;
  fecha: string;
  asistencia: 'Presente' | 'Falta' | 'Retardo';
  checador_id: number;
  created_at?: string;
}

export interface AsistenciaJefe {
  id?: number;
  horario_id?: number;
  fecha: string;
  asistencia: 'Presente' | 'Falta' | 'Retardo';
  jefe_id: number;
  created_at?: string;
}

export interface AsistenciaMaestro {
  id?: number;
  horario_id?: number;
  fecha: string;
  asistencia: 'Presente' | 'Falta' | 'Retardo';
  maestro_id: number;
  created_at?: string;
}

// Legacy interface para mantener compatibilidad
export interface Asistencia {
  id?: number;
  horario_id?: number;
  fecha?: string;
  asistencia?: 'Presente' | 'Falta' | 'Retardo';
  estado?: 'presente' | 'ausente' | 'pendiente';
  created_at?: string;
}

export interface AsistenciaResumen {
  horario: any;
  asistencias: Asistencia[];
  estadisticas: {
    presentes: number;
    ausentes: number;
    sinRegistro: number;
  };
}

