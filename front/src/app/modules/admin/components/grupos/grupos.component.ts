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
import { GrupoService } from '../../../../services/api/grupo.service';
import { ToastService } from '../../../../services/toast.service';
import { CarreraService } from '../../../../services/api/carrera.service';
import { EdificioService } from '../../../../services/api/edificio.service';
import { AulaService } from '../../../../services/api/aula.service';
import { UsuarioService } from '../../../../services/api/usuario.service';
import { Grupo, Carrera, Edificio, Aula, Usuario } from '../../../../models';

@Component({
  selector: 'app-grupos',
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
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit {
  grupos: Grupo[] = [];
  gruposFiltrados: Grupo[] = [];
  carreras: Carrera[] = [];
  jefes: Usuario[] = [];
  edificios: Edificio[] = [];
  aulas: Aula[] = [];

  // Formulario
  newGroup = '';
  selectedCarrera = '';
  selectedJefe = '';
  selectedAula = '';
  selectedGrupo: Grupo | null = null;
  
  // UI
  loading = false;
  showForm = false;
  isEditing = false;
  searchTerm = '';
  displayedColumns = ['nombre', 'carrera', 'jefe', 'aula', 'edificio', 'acciones'];

  constructor(
    private grupoService: GrupoService,
    private carreraService: CarreraService,
    private edificioService: EdificioService,
    private aulaService: AulaService,
    private usuarioService: UsuarioService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadGrupos();
    this.loadCarreras();
    this.loadJefes();
    this.loadEdificios();
    this.loadAulas();
  }

  async loadGrupos() {
    this.loading = true;
    try {
      this.grupos = await this.grupoService.getAll();
      this.gruposFiltrados = [...this.grupos];
    } catch (error) {
      this.toastService.error('Error al cargar los grupos');
    } finally {
      this.loading = false;
    }
  }

  async loadCarreras() {
    try {
      this.carreras = await this.carreraService.getAll();
    } catch (error) {
      // Error al cargar carreras
    }
  }

  async loadJefes() {
    try {
      this.jefes = await this.usuarioService.getJefes();
    } catch (error) {
      // Error al cargar jefes
    }
  }

  async loadEdificios() {
    try {
      this.edificios = await this.edificioService.getAll();
    } catch (error) {
      // Error al cargar edificios
    }
  }

  async loadAulas() {
    try {
      this.aulas = await this.aulaService.getAll();
    } catch (error) {
      // Error al cargar aulas
    }
  }

  filterGrupos() {
    if (!this.searchTerm.trim()) {
      this.gruposFiltrados = [...this.grupos];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.gruposFiltrados = this.grupos.filter(g => 
      g.name.toLowerCase().includes(term) ||
      this.getCarreraNombre(g.carrera_id).toLowerCase().includes(term) ||
      this.getJefeNombre(g.jefe_id).toLowerCase().includes(term)
    );
  }

  openForm(grupo?: Grupo) {
    if (grupo) {
      this.isEditing = true;
      this.selectedGrupo = grupo;
      this.newGroup = grupo.name;
      this.selectedCarrera = grupo.carrera_id?.toString() || '';
      this.selectedJefe = grupo.jefe_id?.toString() || '';
      this.selectedAula = grupo.aula_id?.toString() || '';
    } else {
      this.isEditing = false;
      this.clearForm();
    }
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.clearForm();
  }

  async crearGrupo() {
    if (!this.newGroup || !this.selectedCarrera || !this.selectedJefe || !this.selectedAula) {
      this.toastService.warning('Por favor complete todos los campos');
      return;
    }

    this.loading = true;

    const grupoData: Grupo = {
      name: this.newGroup,
      carrera_id: Number(this.selectedCarrera),
      jefe_id: Number(this.selectedJefe),
      aula_id: Number(this.selectedAula)
    };

    try {
      if (this.isEditing && this.selectedGrupo) {
        await this.grupoService.update(this.selectedGrupo.id!, grupoData);
        this.toastService.success('Grupo actualizado correctamente');
      } else {
        await this.grupoService.create(grupoData);
        this.toastService.success('Grupo creado correctamente');
      }
      
      await this.loadGrupos();
      this.closeForm();
    } catch (error) {
      this.toastService.error(this.isEditing ? 'Error al actualizar el grupo' : 'Error al crear el grupo');
    } finally {
      this.loading = false;
    }
  }

  confirmDelete(grupo: Grupo) {
    if (confirm(`¿Está seguro de eliminar el grupo "${grupo.name}"?\n\nEsta acción no se puede deshacer.`)) {
      this.eliminarGrupo(grupo);
    }
  }

  async eliminarGrupo(grupo: Grupo) {
    if (!grupo.id) return;

    this.loading = true;

    try {
      await this.grupoService.delete(grupo.id);
      this.toastService.success('Grupo eliminado correctamente');
      await this.loadGrupos();
    } catch (error) {
      this.toastService.error('Error al eliminar el grupo');
    } finally {
      this.loading = false;
    }
  }

  getCarreraNombre(carreraId?: number): string {
    if (!carreraId) return 'N/A';
    const carrera = this.carreras.find(c => c.id === carreraId);
    return carrera?.nombre || 'N/A';
  }

  getJefeNombre(jefeId?: number): string {
    if (!jefeId) return 'N/A';
    const jefe = this.jefes.find(j => j.id === jefeId);
    return jefe?.name || 'N/A';
  }

  getAulaNombre(aulaId?: string): string {
    if (!aulaId) return 'N/A';
    const aula = this.aulas.find(a => a.id === Number(aulaId));
    return aula?.numero || 'N/A';
  }

  getEdificioNombre(aulaId?: string): string {
    if (!aulaId) return 'N/A';
    const aula = this.aulas.find(a => a.id === Number(aulaId));
    if (!aula?.edificio_id) return 'N/A';
    const edificio = this.edificios.find(e => e.id === aula.edificio_id);
    return edificio?.nombre || 'N/A';
  }

  // Helper para mostrar edificio en el selector de aulas
  getEdificioNombreByAula(edificioId?: number): string {
    if (!edificioId) return '';
    const edificio = this.edificios.find(e => e.id === edificioId);
    return edificio?.nombre || '';
  }

  clearForm() {
    this.newGroup = '';
    this.selectedCarrera = '';
    this.selectedJefe = '';
    this.selectedAula = '';
    this.selectedGrupo = null;
  }
}
