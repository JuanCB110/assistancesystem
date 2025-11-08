import { Injectable } from '@angular/core';
import { Usuario } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor() {}

  async getAll(): Promise<Usuario[]> {
    try {
      const response = await fetch(this.apiUrl);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      return [];
    }
  }

  async getByRole(role: string): Promise<Usuario[]> {
    try {
      const response = await fetch(`${this.apiUrl}?role=${role}`);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      return [];
    }
  }

  async getMaestros(): Promise<Usuario[]> {
    try {
      const response = await fetch(`${this.apiUrl}/maestros`);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      return [];
    }
  }

  async getAlumnos(): Promise<Usuario[]> {
    return this.getByRole('Alumno');
  }

  async getJefes(): Promise<Usuario[]> {
    try {
      const response = await fetch(`${this.apiUrl}/jefes`);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      return [];
    }
  }

  async getById(id: number): Promise<Usuario | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      return null;
    }
  }

  async getByNumeroCuenta(numeroCuenta: string): Promise<Usuario | null> {
    try {
      const response = await fetch(`${this.apiUrl}/numero-cuenta/${numeroCuenta}`);
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      return null;
    }
  }

  async create(usuario: Partial<Usuario>): Promise<Usuario> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }

  async update(id: number, usuario: Partial<Usuario>): Promise<Usuario> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
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
