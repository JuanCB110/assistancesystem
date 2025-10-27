export interface Materia {
  id?: number;
  name: string;
  carrera_id?: number;
  semestre?: number;
  carrera?: { nombre: string };
  created_at?: string;
}
