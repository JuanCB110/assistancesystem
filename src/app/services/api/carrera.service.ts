import { Injectable } from '@angular/core';
import { Carrera } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {
  private apiUrl = 'http://localhost:3000/api/carreras';

  constructor() {}

  async getAll(): Promise<Carrera[]> {
    try {
      const response = await fetch(this.apiUrl);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error al obtener carreras:', error);
      return [];
    }
  }

  async getById(id: number): Promise<Carrera | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error al obtener carrera:', error);
      return null;
    }
  }

  async create(carrera: Partial<Carrera>): Promise<Carrera> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carrera)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }

  async update(id: number, carrera: Partial<Carrera>): Promise<Carrera> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carrera)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
  }
}
