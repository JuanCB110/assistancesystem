import { Injectable } from '@angular/core';
import { Asistencia, AsistenciaChecador, AsistenciaJefe, AsistenciaMaestro } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private apiUrl = 'http://localhost:3000/api/asistencias';

  constructor() {}

  // ==================== ASISTENCIAS CHECADOR ====================
  async getAsistenciasChecador(filters?: { horario_id?: number; fecha?: string }): Promise<AsistenciaChecador[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.horario_id) params.append('horario_id', filters.horario_id.toString());
      if (filters?.fecha) params.append('fecha', filters.fecha);
      
      const url = `${this.apiUrl}/checador${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error al obtener asistencias checador:', error);
      return [];
    }
  }

  async createAsistenciaChecador(asistencia: AsistenciaChecador): Promise<AsistenciaChecador> {
    try {
      const response = await fetch(`${this.apiUrl}/checador`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asistencia)
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al crear asistencia checador:', error);
      throw error;
    }
  }

  async updateAsistenciaChecador(id: number, asistencia: 'Presente' | 'Falta' | 'Retardo'): Promise<AsistenciaChecador> {
    try {
      const response = await fetch(`${this.apiUrl}/checador/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asistencia })
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al actualizar asistencia checador:', error);
      throw error;
    }
  }

  // ==================== ASISTENCIAS JEFE ====================
  async getAsistenciasJefe(filters?: { horario_id?: number; fecha?: string }): Promise<AsistenciaJefe[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.horario_id) params.append('horario_id', filters.horario_id.toString());
      if (filters?.fecha) params.append('fecha', filters.fecha);
      
      const url = `${this.apiUrl}/jefe${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error al obtener asistencias jefe:', error);
      return [];
    }
  }

  async createAsistenciaJefe(asistencia: AsistenciaJefe): Promise<AsistenciaJefe> {
    try {
      const response = await fetch(`${this.apiUrl}/jefe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asistencia)
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al crear asistencia jefe:', error);
      throw error;
    }
  }

  async updateAsistenciaJefe(id: number, asistencia: 'Presente' | 'Falta' | 'Retardo'): Promise<AsistenciaJefe> {
    try {
      const response = await fetch(`${this.apiUrl}/jefe/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asistencia })
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al actualizar asistencia jefe:', error);
      throw error;
    }
  }

  // ==================== ASISTENCIAS MAESTRO ====================
  async getAsistenciasMaestro(filters?: { horario_id?: number; fecha?: string }): Promise<AsistenciaMaestro[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.horario_id) params.append('horario_id', filters.horario_id.toString());
      if (filters?.fecha) params.append('fecha', filters.fecha);
      
      const url = `${this.apiUrl}/maestro${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error al obtener asistencias maestro:', error);
      return [];
    }
  }

  async createAsistenciaMaestro(asistencia: AsistenciaMaestro): Promise<AsistenciaMaestro> {
    try {
      const response = await fetch(`${this.apiUrl}/maestro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asistencia)
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al crear asistencia maestro:', error);
      throw error;
    }
  }

  // ==================== RESUMEN (para vistas administrativas) ====================
  async getResumenAsistencias(maestroId: number, fecha: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/resumen/${maestroId}/${fecha}`);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al obtener resumen de asistencias:', error);
      return null;
    }
  }

  // ==================== MÉTODOS LEGACY (mantener compatibilidad) ====================
  async getAll(): Promise<Asistencia[]> {
    try {
      const response = await fetch(this.apiUrl);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error al obtener asistencias:', error);
      return [];
    }
  }

  async getByHorario(horarioId: number): Promise<Asistencia[]> {
    try {
      const response = await fetch(`${this.apiUrl}?horario_id=${horarioId}`);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error al obtener asistencias del horario:', error);
      return [];
    }
  }

  async getByMaestroAndWeek(maestroId: number, startDate: string, endDate: string): Promise<Asistencia[]> {
    try {
      const response = await fetch(`${this.apiUrl}?maestro_id=${maestroId}&start_date=${startDate}&end_date=${endDate}`);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error al obtener asistencias del maestro:', error);
      return [];
    }
  }

  async getById(id: number): Promise<Asistencia | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error al obtener asistencia:', error);
      return null;
    }
  }

  async create(asistencia: Asistencia): Promise<Asistencia> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asistencia)
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al crear asistencia:', error);
      throw error;
    }
  }

  async update(id: number, asistencia: Partial<Asistencia>): Promise<Asistencia> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asistencia)
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al actualizar asistencia:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error al eliminar asistencia:', error);
      throw error;
    }
  }
}
