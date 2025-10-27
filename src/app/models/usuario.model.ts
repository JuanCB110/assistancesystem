export interface Usuario {
  id?: number;
  auth_id?: string;
  name: string;
  email?: string;
  password?: string;
  role?: 'Alumno' | 'Jefe de Grupo' | 'Checador' | 'Maestro' | 'Administrador';
  numero_cuenta?: string;
  activo?: boolean;
  created_at?: string;
}

export type UserRole = 'Alumno' | 'Jefe de Grupo' | 'Checador' | 'Maestro' | 'Administrador';
