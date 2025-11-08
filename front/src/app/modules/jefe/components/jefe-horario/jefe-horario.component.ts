import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HorarioService } from '../../../../services/api/horario.service';
import { AsistenciaService } from '../../../../services/api/asistencia.service';
import { GrupoService } from '../../../../services/api/grupo.service';
import { AuthService } from '../../../../services/auth.service';

interface HorarioData {
  dia: string;
  hora_inicio: string;
  hora_fin: string;
  materia: string;
  maestro: string;
  asistencia: 'Presente' | 'Falta' | 'Retardo' | 'pendiente';
  horarioId?: number;
}

@Component({
  selector: 'app-jefe-horario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './jefe-horario.component.html',
  styleUrl: './jefe-horario.component.css'
})
export class JefeHorarioComponent implements OnInit {
  loading = false;
  error: string | null = null;
  success: string | null = null;
  
  horarioMap = new Map<string, HorarioData>();
  grupoInfo: { name: string; aula: string; edificio: string } | null = null;
  diaActual = '';
  selectedDate = '';
  maxDate = '';
  horasNecesarias: string[] = [];
  
  displayedColumns = ['hora', 'dia'];
  
  readonly DIAS_MAP: { [key: number]: string } = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes'
  };

  constructor(
    private horarioService: HorarioService,
    private asistenciaService: AsistenciaService,
    private grupoService: GrupoService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser;
    if (!user) {
      this.error = 'No se encontró sesión activa';
      return;
    }
    
    this.selectedDate = this.getToday();
    this.maxDate = this.getToday();
    this.updateDiaActual();
    this.cargarHorarios();
  }

  getToday(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  updateDiaActual() {
    const parts = this.selectedDate.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    const dateObj = new Date(year, month, day);
    const diaSemana = dateObj.getDay();
    this.diaActual = this.DIAS_MAP[diaSemana] || '';
  }

  async cargarHorarios() {
    this.updateDiaActual();
    if (!this.diaActual) {
      this.error = 'No se pudo determinar el día actual';
      return;
    }

    try {
      this.loading = true;
      const user = this.authService.currentUser;
      if (!user || !user.id) {
        this.error = 'No se encontró información del usuario';
        return;
      }

      // Obtener el grupo del jefe
      const grupos = await this.grupoService.getAll();
      const miGrupo = grupos.find(g => g.jefe_id === user.id);
      
      if (!miGrupo) {
        this.error = 'No se encontró ningún grupo asignado. Contacte al administrador.';
        return;
      }

      this.grupoInfo = {
        name: miGrupo.name || '',
        aula: miGrupo.aula?.numero || 'Sin asignar',
        edificio: miGrupo.aula?.edificio?.nombre || 'Sin asignar'
      };

      // Obtener los horarios del grupo
      const todosHorarios = await this.horarioService.getAll();
      const horariosGrupo = todosHorarios.filter(h => h.grupo_id === miGrupo.id);

      // Filtrar por día actual
      const horariosFiltrados = horariosGrupo.filter(h => {
        if (!h.dias) return false;
        const diasNormalizados = h.dias.toLowerCase().replace(/\s+/g, '');
        const diaActualNormalizado = this.diaActual.toLowerCase();
        return diasNormalizados.includes(diaActualNormalizado);
      });

      // Obtener asistencias del día
      const asistenciasDia = await this.asistenciaService.getAsistenciasJefe({
        fecha: this.selectedDate
      });

      // Crear el mapa de horarios
      this.horarioMap.clear();
      const horasSet = new Set<string>();

      horariosFiltrados.forEach(horario => {
        const asistenciaHoy = asistenciasDia.find(a => a.horario_id === horario.id);
        const horaKey = horario.hora_inicio || '';
        
        if (horaKey) {
          horasSet.add(horaKey);
          const key = `${this.diaActual}-${horaKey}`;
          
          const maestroData = horario.usuario && 'name' in horario.usuario ? horario.usuario : null;
          
          this.horarioMap.set(key, {
            dia: this.diaActual,
            hora_inicio: horario.hora_inicio || '',
            hora_fin: horario.hora_fin || '',
            materia: horario.materia?.name || '',
            maestro: (maestroData as any)?.name || '',
            asistencia: asistenciaHoy?.asistencia || 'pendiente',
            horarioId: horario.id
          });
        }
      });

      // Calcular horas necesarias
      if (horasSet.size > 0) {
        this.horasNecesarias = Array.from(horasSet).sort();
      } else {
        this.horasNecesarias = [];
      }

      this.success = 'Horario cargado correctamente';
      setTimeout(() => this.success = null, 3000);
    } catch (error: any) {
      this.error = error.message || 'Error al cargar horarios';
    } finally {
      this.loading = false;
    }
  }

  async handleToggleAsistencia(dia: string, hora: string, nuevoEstado: 'Presente' | 'Falta' | 'Retardo') {
    const key = `${dia}-${hora}`;
    const horario = this.horarioMap.get(key);
    
    if (!horario?.horarioId) return;

    try {
      this.loading = true;
      
      const user = this.authService.currentUser;
      if (!user) return;

      // Buscar si ya existe un registro
      const asistencias = await this.asistenciaService.getAsistenciasJefe({
        horario_id: horario.horarioId,
        fecha: this.selectedDate
      });
      
      const existing = asistencias.find(a => 
        a.horario_id === horario.horarioId && 
        a.fecha === this.selectedDate
      );

      if (existing && existing.id) {
        // Actualizar estado existente
        await this.asistenciaService.updateAsistenciaJefe(existing.id, nuevoEstado);
      } else {
        // Crear nueva asistencia
        await this.asistenciaService.createAsistenciaJefe({
          horario_id: horario.horarioId,
          jefe_id: user.id,
          fecha: this.selectedDate,
          asistencia: nuevoEstado
        });
      }

      // Actualizar el estado local - crear nuevo Map para que Angular detecte el cambio
      const newMap = new Map(this.horarioMap);
      newMap.set(key, {
        ...horario,
        asistencia: nuevoEstado
      });
      this.horarioMap = newMap;
      
      this.success = `Asistencia actualizada a: ${nuevoEstado}`;
      setTimeout(() => this.success = null, 3000);
    } catch (error: any) {
      this.error = 'Error al actualizar asistencia: ' + error.message;
    } finally {
      this.loading = false;
    }
  }

  onDateChange() {
    this.cargarHorarios();
  }

  setHoy() {
    this.selectedDate = this.getToday();
    this.cargarHorarios();
  }

  formatHora(hora: string): string {
    if (!hora) return '';
    const [h, m] = hora.split(':');
    const horaNum = parseInt(h);
    return `${hora.substring(0, 5)} - ${(horaNum + 1).toString().padStart(2, '0')}:00`;
  }

  getHorarioArray() {
    return this.horasNecesarias.map(hora => {
      const key = `${this.diaActual}-${hora}`;
      return this.horarioMap.get(key) || {
        dia: this.diaActual,
        hora_inicio: hora,
        hora_fin: '',
        materia: '',
        maestro: '',
        asistencia: 'pendiente' as const
      };
    });
  }

  handleCloseAlert() {
    this.error = null;
    this.success = null;
  }
}
