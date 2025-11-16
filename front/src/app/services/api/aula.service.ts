import { Injectable } from '@angular/core';
import { Aula } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AulaService {
  private apiUrl = `${environment.apiUrl}/aulas`;

  constructor() {}

  async getAll(): Promise<Aula[]> {
    try {
      const response = await fetch(this.apiUrl);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      return [];
    }
  }

  async getById(id: number): Promise<Aula | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      return null;
    }
  }

  async create(aula: Aula): Promise<Aula> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aula)
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, aula: Partial<Aula>): Promise<Aula> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aula)
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
