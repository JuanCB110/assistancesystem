import { Injectable } from '@angular/core';
import { Materia } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private apiUrl = `${environment.apiUrl}/materias`;

  constructor() {}

  async getAll(): Promise<Materia[]> {
    try {
      const response = await fetch(this.apiUrl);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      return [];
    }
  }

  async getByCarrera(carreraId: number): Promise<Materia[]> {
    try {
      const response = await fetch(`${this.apiUrl}?carrera_id=${carreraId}`);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      return [];
    }
  }

  async getById(id: number): Promise<Materia | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      const result = await response.json();
      return result.data || null;
    } catch (error) {
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
