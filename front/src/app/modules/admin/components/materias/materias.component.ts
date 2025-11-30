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
import { MateriaService } from '../../../../services/api/materia.service';
import { ToastService } from '../../../../services/toast.service';
import { CarreraService } from '../../../../services/api/carrera.service';
import { Materia, Carrera } from '../../../../models';

@Component({
  selector: 'app-materias',
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
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css']
})
export class MateriasComponent implements OnInit {
  materias: Materia[] = [];
  materiasFiltradas: Materia[] = [];
  carreras: Carrera[] = [];

  newMateria = '';
  selectedCarrera = '';
  selectedSemestre = '';
  selectedMateria: Materia | null = null;

  loading = false;
  showForm = false;
  isEditing = false;
  searchTerm = '';

  semestres: number[] = [];
  displayedColumns = ['nombre', 'carrera', 'semestre', 'acciones'];

  constructor(
    private materiaService: MateriaService,
    private carreraService: CarreraService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadMaterias();
    this.loadCarreras();
  }

  async loadMaterias() {
    this.loading = true;
    try {
      this.materias = await this.materiaService.getAll();
      this.materiasFiltradas = [...this.materias];
    } catch (error) {
      this.toastService.error('Error al cargar las materias');
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

  filterMaterias() {
    if (!this.searchTerm.trim()) {
      this.materiasFiltradas = [...this.materias];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.materiasFiltradas = this.materias.filter(m => 
      m.name.toLowerCase().includes(term) ||
      this.getCarreraNombre(m.carrera_id).toLowerCase().includes(term)
    );
  }

  openForm(materia?: Materia) {
    if (materia) {
      this.isEditing = true;
      this.selectedMateria = materia;
      this.newMateria = materia.name;
      this.selectedCarrera = materia.carrera_id?.toString() || '';
      this.selectedSemestre = materia.semestre?.toString() || '';
      this.onCarreraChange();
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

  async crearMateria() {
    if (!this.newMateria || !this.selectedCarrera) {
      this.toastService.warning('Por favor complete el nombre y la carrera');
      return;
    }

    this.loading = true;

    const materiaData: Materia = {
      name: this.newMateria,
      carrera_id: Number(this.selectedCarrera),
      semestre: this.selectedSemestre ? Number(this.selectedSemestre) : undefined
    };

    try {
      if (this.isEditing && this.selectedMateria) {
        await this.materiaService.update(this.selectedMateria.id!, materiaData);
        this.toastService.success('Materia actualizada correctamente');
      } else {
        await this.materiaService.create(materiaData);
        this.toastService.success('Materia creada correctamente');
      }
      
      await this.loadMaterias();
      this.closeForm();
    } catch (error) {
      this.toastService.error(this.isEditing ? 'Error al actualizar la materia' : 'Error al crear la materia');
    } finally {
      this.loading = false;
    }
  }

  confirmDelete(materia: Materia) {
    if (confirm(`¿Está seguro de eliminar la materia "${materia.name}"?\n\nEsta acción no se puede deshacer.`)) {
      this.eliminarMateria(materia);
    }
  }

  async eliminarMateria(materia: Materia) {
    if (!materia.id) return;

    this.loading = true;

    try {
      await this.materiaService.delete(materia.id);
      this.toastService.success('Materia eliminada correctamente');
      await this.loadMaterias();
    } catch (error) {
      this.toastService.error('Error al eliminar la materia');
    } finally {
      this.loading = false;
    }
  }

  clearForm() {
    this.newMateria = '';
    this.selectedCarrera = '';
    this.selectedSemestre = '';
    this.semestres = [];
    this.selectedMateria = null;
  }

  onCarreraChange() {
    this.selectedSemestre = '';
    this.semestres = [];
    
    if (this.selectedCarrera) {
      const carrera = this.carreras.find(c => c.id === Number(this.selectedCarrera));
      if (carrera && carrera.semestres) {
        this.semestres = Array.from({ length: carrera.semestres }, (_, i) => i + 1);
      }
    }
  }

  getCarreraNombre(carreraId?: number): string {
    if (!carreraId) return 'N/A';
    const carrera = this.carreras.find(c => c.id === carreraId);
    return carrera?.nombre || 'N/A';
  }
}
