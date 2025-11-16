import { Injectable } from '@angular/core';
import { Edificio } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EdificioService {
  private apiUrl = `${environment.apiUrl}/edificios`;

  constructor() {}

  async getAll(): Promise<Edificio[]> {
    try {
      const response = await fetch(this.apiUrl);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      return [];
    }
  }

  async getById(id: number): Promise<Edificio | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      const result = await response.json();
      return result.data || null;
    } catch (error) {
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
