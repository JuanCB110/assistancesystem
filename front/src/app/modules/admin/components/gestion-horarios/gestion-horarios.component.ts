import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HorarioService } from '../../../../services/api/horario.service';
import { ToastService } from '../../../../services/toast.service';
import { UsuarioService } from '../../../../services/api/usuario.service';
import { MateriaService } from '../../../../services/api/materia.service';
import { GrupoService } from '../../../../services/api/grupo.service';
import { CarreraService } from '../../../../services/api/carrera.service';
import { HorarioMaestro, Usuario, Materia, Grupo, Carrera } from '../../../../models';

@Component({
  selector: 'app-gestion-horarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './gestion-horarios.component.html',
  styleUrls: ['./gestion-horarios.component.css']
})
export class GestionHorariosComponent implements OnInit {
  maestros: Usuario[] = [];
  materias: Materia[] = [];
  grupos: Grupo[] = [];
  horarios: HorarioMaestro[] = [];
  carreras: Carrera[] = [];

  // Formulario
  selectedMaestro = '';
  selectedMateria = '';
  selectedGrupo = '';
  selectedDias: string[] = [];
  horaInicio = '';
  horaFin = '';

  // Filtros
  filtroCarrera = '';
  filtroTipo: 'carrera' | 'maestro' = 'carrera';
  filtroGrupo = '';

  // UI
  loading = false;
  showForm = false;
  isEditing = false;
  selectedHorario: HorarioMaestro | null = null;

  // 12-hour time format
  ampm: 'AM' | 'PM' = 'AM';
  ampmFin: 'AM' | 'PM' = 'AM';

  // Constantes
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Tabla
  displayedColumns = ['maestro', 'materia', 'grupo', 'edificio', 'aula', 'dias', 'hora', 'accion'];

  constructor(
    private horarioService: HorarioService,
    private usuarioService: UsuarioService,
    private materiaService: MateriaService,
    private grupoService: GrupoService,
    private carreraService: CarreraService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      this.maestros = await this.usuarioService.getMaestros();
      this.materias = await this.materiaService.getAll();
      this.grupos = await this.grupoService.getAll();
      this.carreras = await this.carreraService.getAll();
      this.horarios = await this.horarioService.getAll();
    } catch (error) {
      this.toastService.error('Error al cargar datos de la base de datos');
    } finally {
      this.loading = false;
    }
  }

  // 🎭 Ya no necesario - datos estáticos cargados

  convertTo24Hour(time12: string, ampm: 'AM' | 'PM'): string {
    if (!time12) return '';
    const [hours, minutes] = time12.split(':').map(Number);
    let hours24 = hours;
    
    if (ampm === 'PM' && hours !== 12) {
      hours24 = hours + 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours24 = 0;
    }
    
    return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  openForm(horario?: HorarioMaestro) {
    if (horario) {
      this.isEditing = true;
      this.selectedHorario = horario;
      this.selectedMaestro = horario.maestro_id?.toString() || '';
      this.selectedMateria = horario.materia_id?.toString() || '';
      this.selectedGrupo = horario.grupo_id?.toString() || '';
      this.selectedDias = horario.dias?.split(',').map(d => d.trim()) || [];
      
      // Convert 24-hour to 12-hour for display
      if (horario.hora_inicio) {
        const [horaInicio, ampmInicio] = this.convertTo12Hour(horario.hora_inicio);
        this.horaInicio = horaInicio;
        this.ampm = ampmInicio;
      }
      if (horario.hora_fin) {
        const [horaFin, ampmFin] = this.convertTo12Hour(horario.hora_fin);
        this.horaFin = horaFin;
        this.ampmFin = ampmFin;
      }
    } else {
      this.isEditing = false;
      this.clearForm();
    }
    this.showForm = true;
  }

  convertTo12Hour(time24: string): [string, 'AM' | 'PM'] {
    const [hours24, minutes] = time24.split(':').map(Number);
    const ampm: 'AM' | 'PM' = hours24 >= 12 ? 'PM' : 'AM';
    let hours12 = hours24 % 12;
    if (hours12 === 0) hours12 = 12;
    
    return [`${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`, ampm];
  }

  closeForm() {
    this.showForm = false;
    this.clearForm();
  }

  async crearHorario() {
    // Validaciones
    if (!this.selectedMaestro || !this.selectedMateria || !this.selectedGrupo || 
        this.selectedDias.length === 0 || !this.horaInicio || !this.horaFin) {
      this.toastService.warning('Por favor complete todos los campos');
      return;
    }

    // Convert to 24-hour format for validation and storage
    const horaInicio24 = this.convertTo24Hour(this.horaInicio, this.ampm);
    const horaFin24 = this.convertTo24Hour(this.horaFin, this.ampmFin);

    // Validate end time > start time
    const [horaInicioH, horaInicioM] = horaInicio24.split(':').map(Number);
    const [horaFinH, horaFinM] = horaFin24.split(':').map(Number);
    const inicioMinutos = horaInicioH * 60 + horaInicioM;
    const finMinutos = horaFinH * 60 + horaFinM;
    
    if (finMinutos <= inicioMinutos) {
      this.toastService.warning('La hora de fin debe ser mayor que la hora de inicio');
      return;
    }

    // Validate duration >= 50 minutes
    const duracion = finMinutos - inicioMinutos;
    if (duracion < 50) {
      this.toastService.warning('La duración de la clase debe ser de al menos 50 minutos');
      return;
    }

    // Validar que no haya conflictos de horarios
    const conflicto = this.validarConflictoHorario(horaInicio24, horaFin24);
    if (conflicto) {
      this.toastService.error(conflicto);
      return;
    }

    this.loading = true;

    const horarioData: HorarioMaestro = {
      maestro_id: Number(this.selectedMaestro),
      materia_id: Number(this.selectedMateria),
      grupo_id: Number(this.selectedGrupo),
      dias: this.selectedDias.join(', '),
      hora_inicio: horaInicio24 + ':00',  // Agregar segundos
      hora_fin: horaFin24 + ':00'         // Agregar segundos
    };

    try {
      if (this.isEditing && this.selectedHorario) {
        await this.horarioService.update(this.selectedHorario.id!, horarioData);
        this.toastService.success('Horario actualizado correctamente');
      } else {
        await this.horarioService.create(horarioData);
        this.toastService.success('Horario creado correctamente');
      }
      
      await this.loadData();
      this.closeForm();
    } catch (error) {
      this.toastService.error(this.isEditing ? 'Error al actualizar el horario' : 'Error al crear el horario');
    } finally {
      this.loading = false;
    }
  }

  validarConflictoHorario(horaInicioNueva: string, horaFinNueva: string): string | null {
    const maestroId = Number(this.selectedMaestro);
    const grupoId = Number(this.selectedGrupo);
    const horaInicio = horaInicioNueva + ':00';
    const horaFin = horaFinNueva + ':00';

    // Verificar cada día seleccionado
    for (const dia of this.selectedDias) {
      // Buscar horarios existentes para este día
      const horariosDelDia = this.horarios.filter(h => {
        // Normalizar los días para comparación
        if (!h.dias) return false;
        const diasHorario = h.dias.split(',').map(d => d.trim());
        return diasHorario.includes(dia);
      });

      // Verificar conflicto con el maestro
      const conflictoMaestro = horariosDelDia.find(h => 
        h.maestro_id === maestroId && 
        h.hora_inicio && h.hora_fin &&
        (!this.isEditing || h.id !== this.selectedHorario?.id) &&
        this.hayInterseccionHoraria(h.hora_inicio, h.hora_fin, horaInicio, horaFin)
      );

      if (conflictoMaestro && conflictoMaestro.hora_inicio && conflictoMaestro.hora_fin) {
        const nombreMaestro = this.getMaestroNombre(maestroId);
        const nombreMateria = this.getMateriaNombre(conflictoMaestro.materia_id);
        return `El maestro ${nombreMaestro} ya tiene la materia "${nombreMateria}" el ${dia} de ${conflictoMaestro.hora_inicio.substring(0, 5)} a ${conflictoMaestro.hora_fin.substring(0, 5)}`;
      }

      // Verificar conflicto con el grupo
      const conflictoGrupo = horariosDelDia.find(h => 
        h.grupo_id === grupoId && 
        h.hora_inicio && h.hora_fin &&
        (!this.isEditing || h.id !== this.selectedHorario?.id) &&
        this.hayInterseccionHoraria(h.hora_inicio, h.hora_fin, horaInicio, horaFin)
      );

      if (conflictoGrupo && conflictoGrupo.hora_inicio && conflictoGrupo.hora_fin) {
        const nombreGrupo = this.getGrupoNombre(grupoId);
        const nombreMateria = this.getMateriaNombre(conflictoGrupo.materia_id);
        return `El grupo ${nombreGrupo} ya tiene la materia "${nombreMateria}" el ${dia} de ${conflictoGrupo.hora_inicio.substring(0, 5)} a ${conflictoGrupo.hora_fin.substring(0, 5)}`;
      }
    }

    return null;
  }

  hayInterseccionHoraria(inicio1: string, fin1: string, inicio2: string, fin2: string): boolean {
    // Convertir strings de hora a minutos desde medianoche para comparar
    const toMinutes = (hora: string): number => {
      const [h, m] = hora.split(':').map(Number);
      return h * 60 + m;
    };

    const inicio1Min = toMinutes(inicio1);
    const fin1Min = toMinutes(fin1);
    const inicio2Min = toMinutes(inicio2);
    const fin2Min = toMinutes(fin2);

    // Hay intersección si:
    // - El inicio del horario 2 está dentro del horario 1, O
    // - El fin del horario 2 está dentro del horario 1, O
    // - El horario 2 contiene completamente al horario 1
    return (
      (inicio2Min >= inicio1Min && inicio2Min < fin1Min) ||
      (fin2Min > inicio1Min && fin2Min <= fin1Min) ||
      (inicio2Min <= inicio1Min && fin2Min >= fin1Min)
    );
  }

  confirmDelete(horario: HorarioMaestro) {
    const maestro = this.getMaestroNombre(horario.maestro_id);
    const materia = this.getMateriaNombre(horario.materia_id);
    const grupo = this.getGrupoNombre(horario.grupo_id);
    
    if (confirm(`¿Está seguro de eliminar el horario de ${materia} para ${maestro} con ${grupo}?\n\nEsta acción no se puede deshacer.`)) {
      this.eliminarHorario(horario);
    }
  }

  async eliminarHorario(horario: HorarioMaestro) {
    if (!horario.id) return;

    this.loading = true;

    try {
      await this.horarioService.delete(horario.id);
      this.toastService.success('Horario eliminado correctamente');
      await this.loadData();
    } catch (error) {
      this.toastService.error('Error al eliminar el horario');
    } finally {
      this.loading = false;
    }
  }

  clearForm() {
    this.selectedMaestro = '';
    this.selectedMateria = '';
    this.selectedGrupo = '';
    this.selectedDias = [];
    this.horaInicio = '';
    this.horaFin = '';
    this.ampm = 'AM';
    this.ampmFin = 'AM';
    this.selectedHorario = null;
  }

  getMaestroNombre(maestroId?: number): string {
    if (!maestroId) return 'N/A';
    const maestro = this.maestros.find(m => m.id === maestroId);
    return maestro?.name || 'N/A';
  }

  getMateriaNombre(materiaId?: number): string {
    if (!materiaId) return 'N/A';
    const materia = this.materias.find(m => m.id === materiaId);
    return materia?.name || 'N/A';
  }

  getGrupoNombre(grupoId?: number): string {
    if (!grupoId) return 'N/A';
    const grupo = this.grupos.find(g => g.id === grupoId);
    return grupo?.name || 'N/A';
  }

  getAulaInfo(grupoId?: number): string {
    if (!grupoId) return 'N/A';
    const grupo = this.grupos.find(g => g.id === grupoId);
    return grupo?.aula?.numero || 'N/A';
  }

  getEdificioNombre(grupoId?: number): string {
    if (!grupoId) return 'N/A';
    const grupo = this.grupos.find(g => g.id === grupoId);
    return grupo?.aula?.edificio?.nombre || 'N/A';
  }

  onCarreraFilterChange() {
    // Auto-apply filter when carrera changes
    this.filtroGrupo = '';
  }

  get gruposFiltrados(): Grupo[] {
    if (!this.filtroCarrera) {
      return this.grupos;
    }
    return this.grupos.filter(g => g.carrera_id === Number(this.filtroCarrera));
  }

  get horariosFiltrados(): HorarioMaestro[] {
    if (!this.filtroGrupo) {
      return this.horarios;
    }
    return this.horarios.filter(h => h.grupo_id === Number(this.filtroGrupo));
  }
}
