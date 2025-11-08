import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { HorarioService } from '../../../../services/api/horario.service';
import { UsuarioService } from '../../../../services/api/usuario.service';
import { MateriaService } from '../../../../services/api/materia.service';
import { GrupoService } from '../../../../services/api/grupo.service';
import { CarreraService } from '../../../../services/api/carrera.service';
import { HorarioMaestro, Usuario, Materia, Grupo, Carrera } from '../../../../models';

@Component({
  selector: 'app-consulta-horarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './consulta-horarios.component.html',
  styleUrls: ['./consulta-horarios.component.css']
})
export class ConsultaHorariosComponent implements OnInit {
  horarios: HorarioMaestro[] = [];
  maestros: Usuario[] = [];
  materias: Materia[] = [];
  grupos: Grupo[] = [];
  carreras: Carrera[] = [];

  filtroTipo: 'carrera' | 'maestro' | 'grupo' = 'carrera';
  filtroCarrera = '';
  filtroMaestro = '';
  filtroGrupo = '';

  displayedColumns = ['maestro', 'materia', 'grupo', 'aula', 'dia', 'hora'];

  constructor(
    private horarioService: HorarioService,
    private usuarioService: UsuarioService,
    private materiaService: MateriaService,
    private grupoService: GrupoService,
    private carreraService: CarreraService
  ) { }

  ngOnInit() {
    this.loadSelectors();
  }

  async loadSelectors() {
    try {
      this.maestros = await this.usuarioService.getMaestros();
      this.materias = await this.materiaService.getAll();
      this.grupos = await this.grupoService.getAll();
      this.carreras = await this.carreraService.getAll();
    } catch (err: any) {
      // Error al cargar datos de selectores
    }
  }

  async buscarHorarios() {
    try {
      const filtros: any = {};
      
      if (this.filtroTipo === 'carrera' && this.filtroCarrera) {
        filtros.carrera_id = Number(this.filtroCarrera);
      } else if (this.filtroTipo === 'maestro' && this.filtroMaestro) {
        filtros.maestro_id = Number(this.filtroMaestro);
      } else if (this.filtroTipo === 'grupo' && this.filtroGrupo) {
        filtros.grupo_id = Number(this.filtroGrupo);
      }

      this.horarios = await this.horarioService.searchHorarios(filtros);
    } catch (err: any) {
      // Error al buscar horarios
    }
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
}
