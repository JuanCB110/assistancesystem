export interface HorarioMaestro {
  id?: number;
  maestro_id?: number;
  materia_id?: number;
  grupo_id?: number;
  dias?: string;  // Plural según schema
  hora_inicio?: string;  // TIME en formato "HH:MM:SS"
  hora_fin?: string;     // TIME en formato "HH:MM:SS"
  asistencia?: boolean;
  maestro?: { name: string };
  usuario?: { id: number; name: string };  // Alias para profesor del backend
  materia?: { name: string };
  grupo?: { 
    name: string; 
    aula_id?: string;
    aula?: {
      numero: string;
      edificio_id: number;
      edificio?: { nombre: string };
    };
  };
  created_at?: string;
}
