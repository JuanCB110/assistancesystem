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
import { GrupoService } from '../../../../services/api/grupo.service';
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
    MatIconModule
  ],
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit {
  grupos: Grupo[] = [];
  carreras: Carrera[] = [];
  jefes: Usuario[] = [];
  edificios: Edificio[] = [];
  aulas: Aula[] = [];

  // Formulario
  newGroup = '';
  selectedCarrera = '';
  selectedJefe = '';
  selectedAula = ''; // String porque aula_id es VARCHAR en BD
  
  // UI
  loading = false;
  error: string | null = null;
  success: string | null = null;
  displayedColumns = ['nombre', 'carrera', 'jefe', 'aula', 'edificio', 'accion'];

  constructor(
    private grupoService: GrupoService,
    private carreraService: CarreraService,
    private edificioService: EdificioService,
    private aulaService: AulaService,
    private usuarioService: UsuarioService
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
    this.error = null;
    try {
      this.grupos = await this.grupoService.getAll();
    } catch (error) {
      this.error = 'Error al cargar los grupos de la base de datos';
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

  async crearGrupo() {
    if (!this.newGroup || !this.selectedCarrera || !this.selectedJefe || !this.selectedAula) {
      this.error = 'Por favor complete todos los campos';
      return;
    }

    this.loading = true;
    this.error = null;

    const nuevoGrupo: Grupo = {
      name: this.newGroup,
      carrera_id: Number(this.selectedCarrera),
      jefe_id: Number(this.selectedJefe),  // Ahora es ID numérico
      aula_id: Number(this.selectedAula) // String, como en la BD
    };

    try {
      await this.grupoService.create(nuevoGrupo);
      this.success = 'Grupo creado correctamente';
      this.clearForm();
      await this.loadGrupos();
    } catch (error) {
      this.error = 'Error al crear el grupo';
    } finally {
      this.loading = false;
    }
  }

  async eliminarGrupo(grupo: Grupo) {
    if (!confirm('¿Está seguro de eliminar este grupo?')) {
      return;
    }

    if (!grupo.id) return;

    this.loading = true;
    this.error = null;

    try {
      await this.grupoService.delete(grupo.id);
      this.success = 'Grupo eliminado correctamente';
      await this.loadGrupos();
    } catch (error) {
      this.error = 'Error al eliminar el grupo';
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
  }

  handleCloseAlert() {
    this.error = null;
    this.success = null;
  }
}
