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
import { MateriaService } from '../../../../services/api/materia.service';
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
    MatIconModule
  ],
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css']
})
export class MateriasComponent implements OnInit {
  materias: Materia[] = [];
  carreras: Carrera[] = [];

  newMateria = '';
  selectedCarrera = '';
  selectedSemestre = '';

  loading = false;
  error: string | null = null;
  success: string | null = null;

  semestres: number[] = [];
  displayedColumns = ['nombre', 'carrera', 'semestre', 'acciones'];

  constructor(
    private materiaService: MateriaService,
    private carreraService: CarreraService
  ) { }

  ngOnInit() {
    this.loadMaterias();
    this.loadCarreras();
  }

  async loadMaterias() {
    this.loading = true;
    this.error = null;
    try {
      this.materias = await this.materiaService.getAll();
    } catch (error) {
      this.error = 'Error al cargar las materias de la base de datos';
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

  async crearMateria() {
    if (!this.newMateria || !this.selectedCarrera) {
      this.error = 'Por favor complete el nombre y la carrera';
      return;
    }

    this.loading = true;
    this.error = null;

    const nuevaMateria: Materia = {
      name: this.newMateria,
      carrera_id: Number(this.selectedCarrera),
      semestre: this.selectedSemestre ? Number(this.selectedSemestre) : undefined
    };

    try {
      await this.materiaService.create(nuevaMateria);
      this.success = 'Materia creada correctamente';
      this.clearForm();
      await this.loadMaterias();
    } catch (error) {
      this.error = 'Error al crear la materia';
    } finally {
      this.loading = false;
    }
  }

  async eliminarMateria(materia: Materia) {
    if (!confirm('¿Está seguro de eliminar esta materia?')) {
      return;
    }

    if (!materia.id) return;

    this.loading = true;
    this.error = null;

    try {
      await this.materiaService.delete(materia.id);
      this.success = 'Materia eliminada correctamente';
      await this.loadMaterias();
    } catch (error) {
      this.error = 'Error al eliminar la materia';
    } finally {
      this.loading = false;
    }
  }

  clearForm() {
    this.newMateria = '';
    this.selectedCarrera = '';
    this.selectedSemestre = '';
    this.semestres = [];
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

  handleCloseAlert() {
    this.error = null;
    this.success = null;
  }
}
