import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { GrupoService } from '../../../../services/api/grupo.service';
import { UsuarioService } from '../../../../services/api/usuario.service';
import { HorarioService } from '../../../../services/api/horario.service';
import { CarreraService } from '../../../../services/api/carrera.service';
import { AsistenciaService } from '../../../../services/api/asistencia.service';
import { Grupo } from '../../../../models/grupo.model';
import { Usuario } from '../../../../models/usuario.model';
import { Carrera } from '../../../../models/carrera.model';
import { HorarioMaestro } from '../../../../models/horario.model';

interface HorarioData {
  dia: string;
  hora: string;
  materia: string;
  maestro: string;
  aula: string;
  edificio: string;
  horarioId?: number;
  asistencia?: 'Presente' | 'Falta' | 'Retardo';
}

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const HORAS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

@Component({
  selector: 'app-alumno-horario',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './alumno-horario.component.html',
  styleUrls: ['./alumno-horario.component.css']
})
export class AlumnoHorarioComponent implements OnInit {
  selectedGrupo: string = '';
  selectedMaestro: string = '';
  selectedCarreraFilter: string = '';
  selectedDate: string = '';
  
  grupos: Grupo[] = [];
  maestros: Usuario[] = [];
  carreras: Carrera[] = [];
  
  loading = false;
  error: string | null = null;
  success: string | null = null;
  
  horarioMap = new Map<string, HorarioData>();
  
  readonly DIAS = DIAS;
  readonly HORAS = HORAS;

  constructor(
    private grupoService: GrupoService,
    private usuarioService: UsuarioService,
    private horarioService: HorarioService,
    private carreraService: CarreraService,
    private asistenciaService: AsistenciaService
  ) {}

  ngOnInit() {
    // Establecer fecha de hoy
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.selectedDate = `${year}-${month}-${day}`;
    
    this.loadInitialData();
  }

  getDiaActual(): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const hoy = new Date();
    return dias[hoy.getDay()];
  }

  getDiaSeleccionado(): string {
    const partes = this.selectedDate.split('-');
    const year = parseInt(partes[0]);
    const month = parseInt(partes[1]) - 1;
    const day = parseInt(partes[2]);
    const fecha = new Date(year, month, day);
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[fecha.getDay()];
  }

  async loadInitialData() {
    this.loading = true;
    try {
      const [grupos, usuarios, carreras] = await Promise.all([
        this.grupoService.getAll(),
        this.usuarioService.getAll(),
        this.carreraService.getAll()
      ]);

      this.grupos = grupos;
      this.maestros = usuarios.filter((u: Usuario) => u.role === 'Maestro');
      this.carreras = carreras;
    } catch (err: any) {
      this.error = 'Error al cargar datos iniciales';
    } finally {
      this.loading = false;
    }
  }

  getGruposFiltrados(): Grupo[] {
    if (!this.selectedCarreraFilter) return [];
    return this.grupos.filter(g => g.carrera_id?.toString() === this.selectedCarreraFilter);
  }

  onCarreraChange() {
    this.selectedGrupo = '';
    this.horarioMap.clear();
  }

  async onGrupoChange() {
    this.selectedMaestro = '';
    await this.loadHorario();
  }

  async onMaestroChange() {
    this.selectedGrupo = '';
    await this.loadHorario();
  }

  async onDateChange() {
    if (this.selectedGrupo || this.selectedMaestro) {
      await this.loadHorario();
    }
  }

  async loadHorario() {
    if (!this.selectedGrupo && !this.selectedMaestro) {
      this.horarioMap.clear();
      return;
    }

    this.loading = true;
    try {
      let horarios: HorarioMaestro[];
      
      if (this.selectedGrupo) {
        horarios = await this.horarioService.getByGrupo(parseInt(this.selectedGrupo));
      } else if (this.selectedMaestro) {
        horarios = await this.horarioService.getByMaestro(parseInt(this.selectedMaestro));
      } else {
        horarios = [];
      }

      // Limpiar mapa
      this.horarioMap.clear();

      // Obtener día de la fecha seleccionada
      const fecha = new Date(this.selectedDate + 'T12:00:00');
      const diaSeleccionado = this.getDiaDeFecha(fecha);

      // Llenar SOLO con datos de horarios del día seleccionado
      horarios?.forEach((horario: any) => {
        // Obtener lista de días (puede ser string "Lunes, Martes" o array)
        const diasArray = typeof horario.dias === 'string' 
          ? horario.dias.split(',').map((d: string) => d.trim())
          : Array.isArray(horario.dias) 
            ? horario.dias 
            : [horario.dias];

        // Filtrar solo si incluye el día seleccionado
        if (diasArray.includes(diaSeleccionado)) {
          // Formato de hora es "HH:MM:SS", necesitamos solo "HH:MM"
          const hora = horario.hora_inicio ? horario.hora_inicio.substring(0, 5) : '';
          
          if (hora) {
            const key = `${diaSeleccionado}-${hora}`;
            this.horarioMap.set(key, {
              dia: diaSeleccionado,
              hora: hora,
              materia: horario.materia?.name || '',
              maestro: horario.usuario?.name || '',
              aula: horario.grupo?.aula?.numero || '',
              edificio: horario.grupo?.aula?.edificio?.nombre || '',
              horarioId: horario.id
            });
          }
        }
      });

      // Cargar asistencias del maestro para la fecha seleccionada
      await this.loadAsistencias(horarios);

      this.success = 'Horario cargado correctamente';
      setTimeout(() => this.success = null, 3000);
    } catch (err: any) {
      this.error = 'Error al cargar horario';
    } finally {
      this.loading = false;
    }
  }

  getDiaDeFecha(fecha: Date): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[fecha.getDay()];
  }

  async loadAsistencias(horarios: any[]) {
    if (!horarios || horarios.length === 0) return;
    
    try {
      // Obtener IDs de horarios
      const horarioIds = horarios.map(h => h.id).filter(id => id);
      
      if (horarioIds.length === 0) return;

      // Obtener todas las asistencias de maestro para la fecha seleccionada
      const asistencias = await this.asistenciaService.getAsistenciasMaestro({
        fecha: this.selectedDate
      });

      // Actualizar el Map con las asistencias
      asistencias.forEach(asistencia => {
        const horario = horarios.find(h => h.id === asistencia.horario_id);
        if (horario) {
          const key = `${horario.dia}-${horario.hora}`;
          const horarioData = this.horarioMap.get(key);
          if (horarioData && horarioData.horarioId === asistencia.horario_id) {
            this.horarioMap.set(key, {
              ...horarioData,
              asistencia: asistencia.asistencia
            });
          }
        }
      });
    } catch (error) {
      // Error al cargar asistencias
    }
  }

  getHorasNecesarias(): string[] {
    const horasConClase = new Set<string>();
    
    this.horarioMap.forEach(value => {
      if (value.materia && value.hora) {
        horasConClase.add(value.hora);
      }
    });

    if (horasConClase.size === 0) return [];

    const horasOrdenadas = Array.from(horasConClase).sort((a, b) => {
      const horaA = parseInt(a.split(':')[0]);
      const horaB = parseInt(b.split(':')[0]);
      return horaA - horaB;
    });

    return horasOrdenadas;
  }

  formatHora(hora: string): string {
    if (!hora) return '';
    const horaNum = parseInt(hora.split(':')[0]);
    return `${hora} - ${horaNum + 1}:00`;
  }

  getSelectedGrupo(): Grupo | undefined {
    return this.grupos.find(g => g.id?.toString() === this.selectedGrupo);
  }
}
