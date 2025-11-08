import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { EdificioService } from '../../../../services/api/edificio.service';
import { AulaService } from '../../../../services/api/aula.service';
import { HorarioService } from '../../../../services/api/horario.service';
import { AsistenciaService } from '../../../../services/api/asistencia.service';
import { AuthService } from '../../../../services/auth.service';
import { Edificio, Aula, AsistenciaChecador } from '../../../../models';

interface HorarioData {
  dia: string;
  hora_inicio: string;
  hora_fin: string;
  materia: string;
  maestro: string;
  grupo: string;
  aula?: string;
  edificio?: string;
  asistencia: 'Presente' | 'Falta' | 'Retardo' | 'pendiente';
  horarioId?: number;
}

@Component({
  selector: 'app-control-asistencia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './control-asistencia.component.html',
  styleUrls: ['./control-asistencia.component.css']
})
export class ControlAsistenciaComponent implements OnInit {
  loading = false;
  selectedDate: string = '';
  diaActual: string = '';
  horarioData: Map<string, HorarioData> = new Map();
  horasNecesarias: string[] = [];
  checadorId: number = 0;

  // Filtros
  edificios: Edificio[] = [];
  aulas: Aula[] = [];
  selectedEdificio: number | null = null;
  selectedAula: string = '';

  HORAS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
           '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  DIAS_MAP: { [key: number]: string } = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes'
  };

  constructor(
    private edificioService: EdificioService,
    private aulaService: AulaService,
    private horarioService: HorarioService,
    private asistenciaService: AsistenciaService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser;
    this.checadorId = user?.id || 0;
    
    this.selectedDate = this.getToday();
    this.loadEdificios();
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
    // Evitar problemas de zona horaria
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

  async loadEdificios() {
    try {
      this.edificios = await this.edificioService.getAll();
    } catch (error: any) {
      this.showError('Error al cargar edificios');
    }
  }

  async onEdificioChange() {
    this.selectedAula = '';
    this.aulas = [];

    if (!this.selectedEdificio) {
      this.cargarHorarios();
      return;
    }

    try {
      const todasAulas = await this.aulaService.getAll();
      this.aulas = todasAulas.filter(a => a.edificio_id === this.selectedEdificio);
      this.cargarHorarios();
    } catch (error: any) {
      this.showError('Error al cargar aulas');
    }
  }

  onAulaChange() {
    this.cargarHorarios();
  }

  async cargarHorarios() {
    if (!this.diaActual || !this.selectedDate) return;

    try {
      this.loading = true;
      
      // Obtener todos los horarios
      const todosHorarios = await this.horarioService.getAll();
      
      // Filtrar por día - normalizar texto para evitar problemas con espacios/mayúsculas
      let horariosFiltrados = todosHorarios.filter(h => {
        if (!h.dias) return false;
        
        const diasNormalizados = h.dias.toLowerCase().replace(/\s+/g, '');
        const diaActualNormalizado = this.diaActual.toLowerCase();
        const encontrado = diasNormalizados.includes(diaActualNormalizado);
        
        return encontrado;
      });
      
      // Filtrar por aula si está seleccionada
      if (this.selectedAula) {
        horariosFiltrados = horariosFiltrados.filter(h => 
          h.grupo?.aula?.numero === this.selectedAula
        );
      } else if (this.selectedEdificio) {
        // Filtrar por edificio usando grupo.aula.edificio_id
        horariosFiltrados = horariosFiltrados.filter(h => {
          const edificioId = h.grupo?.aula?.edificio_id;
          return edificioId === this.selectedEdificio;
        });
      }

      // Obtener asistencias del día
      const asistenciasDia = await this.asistenciaService.getAsistenciasChecador({
        fecha: this.selectedDate
      });

      // Calcular horas SOLO de los horarios que existen
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

      // SOLO llenar con horarios reales
      horariosFiltrados.forEach(horario => {
        const asistenciaHoy = asistenciasDia.find(a => a.horario_id === horario.id);
        const horaKey_inicio = horario.hora_inicio ? horario.hora_inicio.substring(0, 5) : '';
        const horaKey_fin =horario.hora_fin ? horario.hora_fin.substring(0, 5) : '';
        const key = `${this.diaActual}-${horaKey_inicio}`;
        
        const grupoData = horario.grupo && 'name' in horario.grupo ? horario.grupo : null;
        const usuarioData = horario.usuario && ('nombre' in horario.usuario || 'name' in horario.usuario) ? horario.usuario : null;
        
        // Obtener info del aula desde grupo.aula
        const aulaInfo = grupoData?.aula ? 
          `${grupoData.aula.numero}${grupoData.aula.edificio?.nombre ? ' - ' + grupoData.aula.edificio.nombre : ''}` : 
          undefined;
        
        horarioMap.set(key, {
          dia: this.diaActual,
          hora_inicio: horaKey_inicio,
          hora_fin: horaKey_fin,
          materia: horario.materia?.name || '',
          maestro: (usuarioData as any)?.nombre || (usuarioData as any)?.name || '',
          grupo: `${grupoData?.name || ''}`,// - ${(usuarioData as any)?.nombre || ''}`,
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
    
    if (!horario?.horarioId || !this.checadorId) return;

    try {
      this.loading = true;
      
      // Buscar registro existente
      const asistenciasExistentes = await this.asistenciaService.getAsistenciasChecador({
        horario_id: horario.horarioId,
        fecha: this.selectedDate
      });
      const existingRecord = asistenciasExistentes[0];

      if (existingRecord && existingRecord.id) {
        // Ya existe - actualizar el estado
        await this.asistenciaService.updateAsistenciaChecador(existingRecord.id, nuevoEstado);
        
        // Actualizar localmente
        const newHorarioData = new Map(this.horarioData);
        newHorarioData.set(key, {
          ...horario,
          asistencia: nuevoEstado
        });
        
        this.horarioData = newHorarioData;
        this.showSuccess(`Asistencia actualizada a: ${nuevoEstado}`);
      } else {
        // Crear nueva asistencia
        const nuevaAsistencia: AsistenciaChecador = {
          horario_id: horario.horarioId,
          fecha: this.selectedDate,
          asistencia: nuevoEstado,
          checador_id: this.checadorId
        };
        
        await this.asistenciaService.createAsistenciaChecador(nuevaAsistencia);

        // Actualizar localmente
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
    const result = this.horasNecesarias.map(hora => {
      const key = `${this.diaActual}-${hora}`;
      return this.horarioData.get(key);
    }).filter(h => h !== undefined) as HorarioData[];
    
    return result;
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

