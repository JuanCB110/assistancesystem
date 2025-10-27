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
import { HorarioService } from '../../../../services/api/horario.service';
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
    MatIconModule
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
  error: string | null = null;
  success: string | null = null;

  // Constantes
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  horasClase = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  // Tabla
  displayedColumns = ['maestro', 'materia', 'grupo', 'aula', 'dias', 'hora', 'accion'];

  constructor(
    private horarioService: HorarioService,
    private usuarioService: UsuarioService,
    private materiaService: MateriaService,
    private grupoService: GrupoService,
    private carreraService: CarreraService
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
      console.error('Error al cargar datos:', error);
      this.error = 'Error al cargar datos de la base de datos';
    } finally {
      this.loading = false;
    }
  }

  // 🎭 Ya no necesario - datos estáticos cargados

  async crearHorario() {
    if (!this.selectedMaestro || !this.selectedMateria || !this.selectedGrupo || 
        this.selectedDias.length === 0 || !this.horaInicio || !this.horaFin) {
      this.error = 'Por favor complete todos los campos';
      return;
    }

    // Validar que no haya conflictos de horarios
    const conflicto = this.validarConflictoHorario();
    if (conflicto) {
      this.error = conflicto;
      return;
    }

    this.loading = true;
    this.error = null;

    const nuevoHorario: HorarioMaestro = {
      maestro_id: Number(this.selectedMaestro),
      materia_id: Number(this.selectedMateria),
      grupo_id: Number(this.selectedGrupo),
      dias: this.selectedDias.join(', '),
      hora_inicio: this.horaInicio + ':00',  // Agregar segundos
      hora_fin: this.horaFin + ':00'         // Agregar segundos
    };

    try {
      await this.horarioService.create(nuevoHorario);
      this.success = 'Horario creado correctamente';
      this.clearForm();
      await this.loadData();
    } catch (error) {
      console.error('Error al crear horarios:', error);
      this.error = 'Error al crear los horarios';
    } finally {
      this.loading = false;
    }
  }

  validarConflictoHorario(): string | null {
    const maestroId = Number(this.selectedMaestro);
    const grupoId = Number(this.selectedGrupo);
    const horaInicioNueva = this.horaInicio + ':00';
    const horaFinNueva = this.horaFin + ':00';

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
        this.hayInterseccionHoraria(h.hora_inicio, h.hora_fin, horaInicioNueva, horaFinNueva)
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
        this.hayInterseccionHoraria(h.hora_inicio, h.hora_fin, horaInicioNueva, horaFinNueva)
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

  async eliminarHorario(horario: HorarioMaestro) {
    if (!confirm('¿Está seguro de eliminar este horario?')) {
      return;
    }

    if (!horario.id) return;

    this.loading = true;
    this.error = null;

    try {
      await this.horarioService.delete(horario.id);
      this.success = 'Horario eliminado correctamente';
      await this.loadData();
    } catch (error) {
      console.error('Error al eliminar horario:', error);
      this.error = 'Error al eliminar el horario';
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
    if (!grupo?.aula) return 'N/A';
    const edificio = grupo.aula.edificio?.nombre || '';
    return `${grupo.aula.numero}${edificio ? ' - ' + edificio : ''}`;
  }

  get gruposFiltrados(): Grupo[] {
    if (!this.filtroCarrera) {
      return this.grupos;
    }
    return this.grupos.filter(g => g.carrera_id === Number(this.filtroCarrera));
  }

  handleCloseAlert() {
    this.error = null;
    this.success = null;
  }
}
