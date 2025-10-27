import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  
  // Datos mock para carreras
  private carreras = [
    { id: 1, nombre: 'Ingeniería en Sistemas Computacionales', codigo: 'ISC', duracion: 9 },
    { id: 2, nombre: 'Ingeniería Industrial', codigo: 'II', duracion: 9 },
    { id: 3, nombre: 'Ingeniería en Gestión Empresarial', codigo: 'IGE', duracion: 9 },
    { id: 4, nombre: 'Licenciatura en Administración', codigo: 'LA', duracion: 8 }
  ];

  // Datos mock para edificios
  private edificios = [
    { id: 1, nombre: 'Edificio Principal', codigo: 'A' },
    { id: 2, nombre: 'Laboratorios', codigo: 'LAB' },
    { id: 3, nombre: 'Biblioteca', codigo: 'BIB' },
    { id: 4, nombre: 'Auditorio', codigo: 'AUD' }
  ];

  // Datos mock para materias
  private materias = [
    { id: 1, nombre: 'Programación I', carrera_id: 1, semestre: 1, carrera: { nombre: 'ISC' } },
    { id: 2, nombre: 'Matemáticas I', carrera_id: 1, semestre: 1, carrera: { nombre: 'ISC' } },
    { id: 3, nombre: 'Física I', carrera_id: 2, semestre: 1, carrera: { nombre: 'II' } },
    { id: 4, nombre: 'Programación II', carrera_id: 1, semestre: 2, carrera: { nombre: 'ISC' } }
  ];

  // Datos mock para usuarios
  private usuarios = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@ejemplo.com', rol: 'Maestro', numero_cuenta: '12345', activo: true },
    { id: 2, nombre: 'María García', email: 'maria@ejemplo.com', rol: 'Alumno', numero_cuenta: '67890', activo: true },
    { id: 3, nombre: 'Carlos López', email: 'carlos@ejemplo.com', rol: 'Administrador', numero_cuenta: '11111', activo: true }
  ];

  // Datos mock para grupos
  private grupos = [
    { id: 1, nombre: '9A', carrera_id: 1, jefe_grupo_id: 2, aula: '101', edificio_id: 1, 
      carrera: { nombre: 'ISC' }, jefe: { nombre: 'María García' }, edificio: { nombre: 'Edificio Principal' } }
  ];

  // Datos mock para horarios
  private horarios = [
    { id: 1, maestro_id: 1, materia_id: 1, grupo_id: 1, dia_semana: 'Lunes', hora_inicio: '08:00', hora_fin: '10:00',
      maestro: { nombre: 'Juan Pérez' }, materia: { nombre: 'Programación I' }, grupo: { nombre: '9A' } }
  ];

  private nextIds = {
    carreras: 5,
    edificios: 5,
    materias: 5,
    usuarios: 4,
    grupos: 2,
    horarios: 2
  };

  constructor() { }

  // Simular delay de API
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Métodos para carreras
  async getCarreras(): Promise<any[]> {
    await this.delay();
    return [...this.carreras];
  }

  async createCarrera(carrera: any): Promise<any> {
    await this.delay();
    const newCarrera = { ...carrera, id: this.nextIds.carreras++ };
    this.carreras.push(newCarrera);
    return newCarrera;
  }

  async deleteCarrera(id: number): Promise<void> {
    await this.delay();
    const index = this.carreras.findIndex(c => c.id === id);
    if (index > -1) {
      this.carreras.splice(index, 1);
    }
  }

  // Métodos para edificios
  async getEdificios(): Promise<any[]> {
    await this.delay();
    return [...this.edificios];
  }

  async createEdificio(edificio: any): Promise<any> {
    await this.delay();
    const newEdificio = { ...edificio, id: this.nextIds.edificios++ };
    this.edificios.push(newEdificio);
    return newEdificio;
  }

  async deleteEdificio(id: number): Promise<void> {
    await this.delay();
    const index = this.edificios.findIndex(e => e.id === id);
    if (index > -1) {
      this.edificios.splice(index, 1);
    }
  }

  // Métodos para materias
  async getMaterias(): Promise<any[]> {
    await this.delay();
    return [...this.materias];
  }

  async createMateria(materia: any): Promise<any> {
    await this.delay();
    const carrera = this.carreras.find(c => c.id === materia.carrera_id);
    const newMateria = { 
      ...materia, 
      id: this.nextIds.materias++,
      carrera: carrera ? { nombre: carrera.codigo } : null
    };
    this.materias.push(newMateria);
    return newMateria;
  }

  async deleteMateria(id: number): Promise<void> {
    await this.delay();
    const index = this.materias.findIndex(m => m.id === id);
    if (index > -1) {
      this.materias.splice(index, 1);
    }
  }

  // Métodos para usuarios
  async getUsuarios(): Promise<any[]> {
    await this.delay();
    return [...this.usuarios];
  }

  async createUsuario(usuario: any): Promise<any> {
    await this.delay();
    const newUsuario = { ...usuario, id: this.nextIds.usuarios++ };
    this.usuarios.push(newUsuario);
    return newUsuario;
  }

  async updateUsuario(id: number, usuario: any): Promise<any> {
    await this.delay();
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index > -1) {
      this.usuarios[index] = { ...this.usuarios[index], ...usuario };
      return this.usuarios[index];
    }
    return null;
  }

  async deleteUsuario(id: number): Promise<void> {
    await this.delay();
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index > -1) {
      this.usuarios.splice(index, 1);
    }
  }

  // Métodos para grupos
  async getGrupos(): Promise<any[]> {
    await this.delay();
    return [...this.grupos];
  }

  async createGrupo(grupo: any): Promise<any> {
    await this.delay();
    const carrera = this.carreras.find(c => c.id === grupo.carrera_id);
    const jefe = this.usuarios.find(u => u.id === grupo.jefe_grupo_id);
    const edificio = this.edificios.find(e => e.id === grupo.edificio_id);
    
    const newGrupo = { 
      ...grupo, 
      id: this.nextIds.grupos++,
      carrera: carrera ? { nombre: carrera.codigo } : null,
      jefe: jefe ? { nombre: jefe.nombre } : null,
      edificio: edificio ? { nombre: edificio.nombre } : null
    };
    this.grupos.push(newGrupo);
    return newGrupo;
  }

  async deleteGrupo(id: number): Promise<void> {
    await this.delay();
    const index = this.grupos.findIndex(g => g.id === id);
    if (index > -1) {
      this.grupos.splice(index, 1);
    }
  }

  // Métodos para horarios
  async getHorarios(): Promise<any[]> {
    await this.delay();
    return [...this.horarios];
  }

  async createHorario(horario: any): Promise<any> {
    await this.delay();
    const maestro = this.usuarios.find(u => u.id === horario.maestro_id);
    const materia = this.materias.find(m => m.id === horario.materia_id);
    const grupo = this.grupos.find(g => g.id === horario.grupo_id);
    
    const newHorario = { 
      ...horario, 
      id: this.nextIds.horarios++,
      maestro: maestro ? { nombre: maestro.nombre } : null,
      materia: materia ? { nombre: materia.nombre } : null,
      grupo: grupo ? { nombre: grupo.nombre } : null
    };
    this.horarios.push(newHorario);
    return newHorario;
  }

  async deleteHorario(id: number): Promise<void> {
    await this.delay();
    const index = this.horarios.findIndex(h => h.id === id);
    if (index > -1) {
      this.horarios.splice(index, 1);
    }
  }

  // Métodos de búsqueda
  async searchHorarios(filters: any): Promise<any[]> {
    await this.delay();
    let result = [...this.horarios];
    
    if (filters.carrera_id) {
      result = result.filter(h => {
        const grupo = this.grupos.find(g => g.id === h.grupo_id);
        return grupo && grupo.carrera_id === filters.carrera_id;
      });
    }
    
    if (filters.maestro_id) {
      result = result.filter(h => h.maestro_id === filters.maestro_id);
    }
    
    if (filters.grupo_id) {
      result = result.filter(h => h.grupo_id === filters.grupo_id);
    }
    
    return result;
  }

  // Método para obtener maestros
  async getMaestros(): Promise<any[]> {
    await this.delay();
    return this.usuarios.filter(u => u.rol === 'Maestro');
  }
}
