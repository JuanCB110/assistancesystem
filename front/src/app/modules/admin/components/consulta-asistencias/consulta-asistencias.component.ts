import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsistenciaService } from '../../../../services/api/asistencia.service';
import { UsuarioService } from '../../../../services/api/usuario.service';
import { HorarioService } from '../../../../services/api/horario.service';
import { Asistencia, Usuario, HorarioMaestro } from '../../../../models';

@Component({
  selector: 'app-consulta-asistencias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './consulta-asistencias.component.html',
  styleUrls: ['./consulta-asistencias.component.css']
})
export class ConsultaAsistenciasComponent implements OnInit {
  maestros: Usuario[] = [];
  asistencias: Asistencia[] = [];
  horarios: HorarioMaestro[] = [];
  
  selectedMaestro = '';
  selectedDate = new Date();
  
  loading = false;
  error: string | null = null;

  weekStats = {
    total: 0,
    asistencias: {
      checador: 0,
      jefe: 0,
      maestro: 0
    },
    faltas: {
      checador: 0,
      jefe: 0,
      maestro: 0
    }
  };

  diasSemana = [
    { nombre: 'Lunes', index: 1 },
    { nombre: 'Martes', index: 2 },
    { nombre: 'Miércoles', index: 3 },
    { nombre: 'Jueves', index: 4 },
    { nombre: 'Viernes', index: 5 }
  ];

  displayedColumns = ['hora', 'materia', 'grupo', 'checador', 'jefe', 'maestro'];

  constructor(
    private asistenciaService: AsistenciaService,
    private usuarioService: UsuarioService,
    private horarioService: HorarioService
  ) { }

  ngOnInit() {
    this.loadMaestros();
  }

  async loadMaestros() {
    try {
      this.maestros = await this.usuarioService.getMaestros();
    } catch (error) {
      this.error = 'Error al cargar profesores de la base de datos';
    }
  }

  async consultarAsistencias() {
    if (!this.selectedMaestro) {
      this.error = 'Por favor seleccione un profesor';
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const startDate = this.getWeekStartDate();
      const endDate = this.getWeekEndDate();
      
      this.asistencias = await this.asistenciaService.getByMaestroAndWeek(
        Number(this.selectedMaestro),
        startDate,
        endDate
      );
      
      this.horarios = await this.horarioService.getByMaestro(Number(this.selectedMaestro));
    } catch (error) {
      this.error = 'Error al consultar las asistencias';
    } finally {
      this.loading = false;
    }
  }

  getWeekStartDate(): string {
    const date = new Date(this.selectedDate);
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    date.setDate(diff);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getWeekEndDate(): string {
    const date = new Date(this.selectedDate);
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) + 6;
    date.setDate(diff);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getWeekRange(): string {
    const startOfWeek = new Date(this.selectedDate);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
  }

  getEstadoText(estado?: string): string {
    switch (estado) {
      case 'Presente': return 'Presente';
      case 'Ausente': return 'Ausente';
      default: return 'Sin registro';
    }
  }

  getEstadoClass(estado?: string): string {
    switch (estado) {
      case 'Presente': return 'presente';
      case 'Ausente': return 'ausente';
      default: return 'sin-registro';
    }
  }

  getHorariosForDay(dia: string): HorarioMaestro[] {
    return this.horarios.filter(h => h.dias === dia);
  }

  getAsistenciaEstado(horarioId?: number, tipo: 'checador' | 'jefe' | 'maestro' = 'checador'): string {
    if (!horarioId) return 'Sin registro';
    
    const asistencia = this.asistencias.find(a => a.horario_id === horarioId);
    
    if (!asistencia) return 'Sin registro';
    
    return asistencia.asistencia || 'Sin registro';
  }

  onMaestroChange() {
    if (this.selectedMaestro) {
      this.consultarAsistencias();
    }
  }

  onDateChange(event: any) {
    this.selectedDate = event.value;
    if (this.selectedMaestro) {
      this.consultarAsistencias();
    }
  }

  getWeekStartFormatted(): string {
    const startOfWeek = new Date(this.selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    return startOfWeek.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }

  getWeekEndFormatted(): string {
    const startOfWeek = new Date(this.selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return endOfWeek.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }

  // Formatear fecha
  formatDate(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  }

  previousWeek() {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    this.selectedDate = newDate;
  }

  nextWeek() {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    this.selectedDate = newDate;
  }

  handleCloseAlert() {
    this.error = null;
  }
}
