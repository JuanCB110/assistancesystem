import { Injectable } from '@angular/core';
import { Materia } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private apiUrl = 'http://localhost:3000/api/materias';

  constructor() {}

  async getAll(): Promise<Materia[]> {
    try {
      const response = await fetch(this.apiUrl);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error al obtener materias:', error);
      return [];
    }
  }

  async getByCarrera(carreraId: number): Promise<Materia[]> {
    try {
      const response = await fetch(`${this.apiUrl}?carrera_id=${carreraId}`);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error al obtener materias por carrera:', error);
      return [];
    }
  }

  async getById(id: number): Promise<Materia | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error al obtener materia:', error);
      return null;
    }
  }

  async create(materia: Materia): Promise<Materia> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materia)
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al crear materia:', error);
      throw error;
    }
  }

  async update(id: number, materia: Partial<Materia>): Promise<Materia> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materia)
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al actualizar materia:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error al eliminar materia:', error);
      throw error;
    }
  }
}
