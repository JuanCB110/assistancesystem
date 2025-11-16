import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { HorarioService } from '../../../../services/api/horario.service';
import { AsistenciaService } from '../../../../services/api/asistencia.service';
import { AuthService } from '../../../../services/auth.service';

interface HorarioData {
  dia: string;
  hora_inicio: string;
  hora_fin: string;
  materia: string;
  grupo: string;
  aula?: string;
  edificio?: string;
  asistencia: 'Presente' | 'Falta' | 'Retardo' | 'pendiente';
  horarioId?: number;
}

@Component({
  selector: 'app-maestro-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatIconModule,
    MatDividerModule
  ],
  providers: [DatePipe],
  templateUrl: './maestro-dashboard.component.html',
  styleUrl: './maestro-dashboard.component.css'
})
export class MaestroDashboardComponent implements OnInit {
  loading = false;
  horarioData: Map<string, HorarioData> = new Map();
  selectedDate: string = '';
  diaActual: string = '';
  horasNecesarias: string[] = [];
  maestroId: number = 0;

  DIAS_MAP: { [key: number]: string } = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes'
  };

  constructor(
    private horarioService: HorarioService,
    private asistenciaService: AsistenciaService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser;
    this.maestroId = user?.id || 0;
    
    this.selectedDate = this.getToday();
    this.updateDiaActual();
  }

  getToday(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  handleHoyClick() {
    this.selectedDate = this.getToday();
    this.updateDiaActual();
  }

  onDateChange() {
    this.updateDiaActual();
  }

  updateDiaActual() {
    const partes = this.selectedDate.split('-');
    const year = parseInt(partes[0]);
    const month = parseInt(partes[1]) - 1;
    const day = parseInt(partes[2]);
    const selectedDateObj = new Date(year, month, day);
    const diaSemana = selectedDateObj.getDay();
    
    if (diaSemana === 0 || diaSemana === 6) {
      this.showError('No hay clases los fines de semana');
      this.diaActual = '';
      this.horarioData.clear();
      return;
    }

    this.diaActual = this.DIAS_MAP[diaSemana] || '';
    this.cargarHorarios();
  }

  async cargarHorarios() {
    if (!this.diaActual || !this.selectedDate) return;

    try {
      this.loading = true;
      
      // Obtener todos los horarios del profesor
      const todosHorarios = await this.horarioService.getByMaestro(this.maestroId);
      
      // Filtrar por día actual
      const horariosFiltrados = todosHorarios.filter(h => {
        if (!h.dias) return false;
        const diasNormalizados = h.dias.toLowerCase().replace(/\s+/g, '');
        const diaActualNormalizado = this.diaActual.toLowerCase();
        return diasNormalizados.includes(diaActualNormalizado);
      });

      // Obtener asistencias del día
      const asistenciasDia = await this.asistenciaService.getAsistenciasMaestro({
        fecha: this.selectedDate
      });

      // Calcular horas necesarias
      if (horariosFiltrados.length > 0) {
        const horasSet = new Set<string>();
        horariosFiltrados.forEach(h => {
          if (h.hora_inicio) {
            const horaFormateada = h.hora_inicio.substring(0, 5);
            horasSet.add(horaFormateada);
          }
        });
        
        this.horasNecesarias = Array.from(horasSet).sort();
      } else {
        this.horasNecesarias = [];
      }

      // Construir mapa de horarios
      const horarioMap = new Map<string, HorarioData>();

      horariosFiltrados.forEach(horario => {
        const asistenciaHoy = asistenciasDia.find(a => a.horario_id === horario.id);
        const horaKey = horario.hora_inicio ? horario.hora_inicio.substring(0, 5) : '';
        const key = `${this.diaActual}-${horaKey}`;
        
        const grupoData = horario.grupo && 'name' in horario.grupo ? horario.grupo : null;
        const aulaInfo = grupoData?.aula ? 
          `${grupoData.aula.numero}${grupoData.aula.edificio?.nombre ? ' - ' + grupoData.aula.edificio.nombre : ''}` : 
          undefined;
        
        horarioMap.set(key, {
          dia: this.diaActual,
          hora_inicio: horaKey,
          hora_fin: horario.hora_fin ? horario.hora_fin.substring(0, 5) : '',
          materia: horario.materia?.name || '',
          grupo: grupoData?.name || '',
          aula: aulaInfo,
          edificio: grupoData?.aula?.edificio?.nombre,
          asistencia: asistenciaHoy?.asistencia || 'pendiente',
          horarioId: horario.id
        });
      });

      this.horarioData = horarioMap;
    } catch (error: any) {
      this.showError('Error al cargar horarios: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  async handleToggleAsistencia(dia: string, hora: string, nuevoEstado: 'Presente' | 'Falta' | 'Retardo') {
    const key = `${dia}-${hora}`;
    const horario = this.horarioData.get(key);
    
    if (!horario?.horarioId || !this.maestroId) return;

    try {
      this.loading = true;
      
      // Buscar registro existente
      const asistenciasExistentes = await this.asistenciaService.getAsistenciasMaestro({
        horario_id: horario.horarioId,
        fecha: this.selectedDate
      });
      const existingRecord = asistenciasExistentes[0];

      if (existingRecord && existingRecord.id) {
        // Actualizar estado existente
        await this.asistenciaService.updateAsistenciaMaestro(existingRecord.id, nuevoEstado);
        
        const newHorarioData = new Map(this.horarioData);
        newHorarioData.set(key, {
          ...horario,
          asistencia: nuevoEstado
        });
        
        this.horarioData = newHorarioData;
        this.showSuccess(`Asistencia actualizada a: ${nuevoEstado}`);
      } else {
        // Crear nueva asistencia
        await this.asistenciaService.createAsistenciaMaestro({
          horario_id: horario.horarioId,
          maestro_id: this.maestroId,
          fecha: this.selectedDate,
          asistencia: nuevoEstado
        });

        const newHorarioData = new Map(this.horarioData);
        newHorarioData.set(key, {
          ...horario,
          asistencia: nuevoEstado
        });
        
        this.horarioData = newHorarioData;
        this.showSuccess(`Asistencia registrada: ${nuevoEstado}`);
      }
    } catch (error: any) {
      this.showError('Error al registrar asistencia: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  getHorarioArray(): HorarioData[] {
    return this.horasNecesarias.map(hora => {
      const key = `${this.diaActual}-${hora}`;
      return this.horarioData.get(key);
    }).filter(h => h !== undefined) as HorarioData[];
  }

  getHorarioData(hora: string): HorarioData | undefined {
    const key = `${this.diaActual}-${hora}`;
    return this.horarioData.get(key);
  }

  formatHora(hora: string): string {
    if (!hora) return '';
    const [h, m] = hora.split(':');
    const horaNum = parseInt(h);
    return `${hora} - ${(horaNum + 1).toString().padStart(2, '0')}:00`;
  }

  showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  showSuccess(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}
