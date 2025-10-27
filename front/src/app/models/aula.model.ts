export interface Aula {
  id?: number;
  numero: string;
  edificio_id: number;
  edificio?: { nombre: string };
  created_at?: string;
}
