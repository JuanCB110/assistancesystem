import { Injectable } from '@angular/core';
import { HorarioMaestro } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private apiUrl = `${environment.apiUrl}/horarios`;

  constructor() {}

  async getAll(): Promise<HorarioMaestro[]> {
    try {
      const response = await fetch(this.apiUrl);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      return [];
    }
  }

  async getByMaestro(maestroId: number): Promise<HorarioMaestro[]> {
    try {
      const response = await fetch(`${this.apiUrl}?maestro_id=${maestroId}`);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      return [];
    }
  }

  async getByGrupo(grupoId: number): Promise<HorarioMaestro[]> {
    try {
      const response = await fetch(`${this.apiUrl}?grupo_id=${grupoId}`);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      return [];
    }
  }

  async getByCarrera(carreraId: number): Promise<HorarioMaestro[]> {
    try {
      const response = await fetch(`${this.apiUrl}?carrera_id=${carreraId}`);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      return [];
    }
  }

  async searchHorarios(filters: {
    carrera_id?: number;
    maestro_id?: number;
    grupo_id?: number;
  }): Promise<HorarioMaestro[]> {
    if (filters.carrera_id) {
      return this.getByCarrera(filters.carrera_id);
    }
    if (filters.maestro_id) {
      return this.getByMaestro(filters.maestro_id);
    }
    if (filters.grupo_id) {
      return this.getByGrupo(filters.grupo_id);
    }
    return this.getAll();
  }

  async getById(id: number): Promise<HorarioMaestro | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      return null;
    }
  }

  async create(horario: HorarioMaestro): Promise<HorarioMaestro> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(horario)
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async createMultiple(horarios: HorarioMaestro[]): Promise<HorarioMaestro[]> {
    try {
      const response = await fetch(`${this.apiUrl}/multiple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horarios })
      });
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, horario: Partial<HorarioMaestro>): Promise<HorarioMaestro> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(horario)
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      throw error;
    }
  }
}
