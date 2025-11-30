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
import { CarreraService } from '../../../../services/api/carrera.service';
import { Carrera } from '../../../../models';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-carreras',
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
  templateUrl: './carreras.component.html',
  styleUrls: ['./carreras.component.css']
})
export class CarrerasComponent implements OnInit {
  carreras: Carrera[] = [];
  carrerasFiltradas: Carrera[] = [];
  newCarrera = '';
  duracion = '';
  showForm = false;
  isEditing = false;
  searchTerm = '';
  selectedCarrera: Carrera | null = null;

  loading = false;

  displayedColumns = ['nombre', 'duracion', 'acciones'];

  constructor(
    private carreraService: CarreraService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadCarreras();
  }

  async loadCarreras() {
    this.loading = true;
    try {
      this.carreras = await this.carreraService.getAll();
      this.carrerasFiltradas = [...this.carreras];
    } catch (error) {
      this.toastService.show('Error al cargar las carreras', 'error');
    } finally {
      this.loading = false;
    }
  }

  filterCarreras() {
    const term = this.searchTerm.toLowerCase();
    this.carrerasFiltradas = this.carreras.filter(c =>
      c.nombre?.toLowerCase().includes(term)
    );
  }

  openForm(carrera?: Carrera) {
    if (carrera) {
      this.isEditing = true;
      this.selectedCarrera = carrera;
      this.newCarrera = carrera.nombre || '';
      this.duracion = carrera.semestres?.toString() || '';
    } else {
      this.isEditing = false;
      this.selectedCarrera = null;
      this.clearForm();
    }
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.isEditing = false;
    this.selectedCarrera = null;
    this.clearForm();
  }

  async crearCarrera() {
    if (!this.newCarrera) {
      this.toastService.show('Por favor complete el nombre de la carrera', 'warning');
      return;
    }

    this.loading = true;

    const carreraData: Carrera = {
      nombre: this.newCarrera,
      semestres: this.duracion ? Number(this.duracion) : undefined
    };

    try {
      if (this.isEditing && this.selectedCarrera?.id) {
        await this.carreraService.update(this.selectedCarrera.id, carreraData);
        this.toastService.show('Carrera actualizada correctamente', 'success');
      } else {
        await this.carreraService.create(carreraData);
        this.toastService.show('Carrera creada correctamente', 'success');
      }
      this.closeForm();
      await this.loadCarreras();
    } catch (error) {
      this.toastService.show(`Error al ${this.isEditing ? 'actualizar' : 'crear'} la carrera`, 'error');
    } finally {
      this.loading = false;
    }
  }

  confirmDelete(carrera: Carrera) {
    if (confirm(`¿Está seguro de eliminar la carrera "${carrera.nombre}"?`)) {
      this.eliminarCarrera(carrera);
    }
  }

  async eliminarCarrera(carrera: Carrera) {
    if (!carrera.id) return;

    this.loading = true;

    try {
      await this.carreraService.delete(carrera.id);
      this.toastService.show('Carrera eliminada correctamente', 'success');
      await this.loadCarreras();
    } catch (error) {
      this.toastService.show('Error al eliminar la carrera', 'error');
    } finally {
      this.loading = false;
    }
  }

  clearForm() {
    this.newCarrera = '';
    this.duracion = '';
    this.selectedCarrera = null;
  }
}
