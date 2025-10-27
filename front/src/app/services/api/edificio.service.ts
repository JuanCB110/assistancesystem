import { Injectable } from '@angular/core';
import { Edificio } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class EdificioService {
  private apiUrl = 'http://localhost:3000/api/edificios';

  constructor() {}

  async getAll(): Promise<Edificio[]> {
    try {
      const response = await fetch(this.apiUrl);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error al obtener edificios:', error);
      return [];
    }
  }

  async getById(id: number): Promise<Edificio | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error al obtener edificio:', error);
      return null;
    }
  }

  async create(edificio: Edificio): Promise<Edificio> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edificio)
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al crear edificio:', error);
      throw error;
    }
  }

  async update(id: number, edificio: Partial<Edificio>): Promise<Edificio> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edificio)
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al actualizar edificio:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error al eliminar edificio:', error);
      throw error;
    }
  }
}
