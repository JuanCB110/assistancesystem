import { Injectable } from '@angular/core';
import { Grupo } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private apiUrl = 'http://localhost:3000/api/grupos';

  constructor() {}

  async getAll(): Promise<Grupo[]> {
    try {
      const response = await fetch(this.apiUrl);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error al obtener grupos:', error);
      return [];
    }
  }

  async getByCarrera(carreraId: number): Promise<Grupo[]> {
    try {
      const response = await fetch(`${this.apiUrl}?carrera_id=${carreraId}`);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error al obtener grupos por carrera:', error);
      return [];
    }
  }

  async getById(id: number): Promise<Grupo | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error al obtener grupo:', error);
      return null;
    }
  }

  async create(grupo: Grupo): Promise<Grupo> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grupo)
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al crear grupo:', error);
      throw error;
    }
  }

  async update(id: number, grupo: Partial<Grupo>): Promise<Grupo> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grupo)
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al actualizar grupo:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error al eliminar grupo:', error);
      throw error;
    }
  }
}
