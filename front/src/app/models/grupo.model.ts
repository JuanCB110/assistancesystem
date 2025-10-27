export interface Grupo {
  id?: number;
  name: string;
  carrera_id?: number;
  jefe_id?: number;  // bigint
  aula_id?: number;  // bigint - FK a tabla aula
  carrera?: { nombre: string };
  jefe?: { name: string };
  aula?: { 
    id?: number;
    numero: string; 
    edificio_id: number;
    edificio?: { nombre: string };
  };
  created_at?: string;
}
