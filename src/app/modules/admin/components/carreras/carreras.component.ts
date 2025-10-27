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
import { CarreraService } from '../../../../services/api/carrera.service';
import { Carrera } from '../../../../models';

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
    MatIconModule
  ],
  templateUrl: './carreras.component.html',
  styleUrls: ['./carreras.component.css']
})
export class CarrerasComponent implements OnInit {
  carreras: Carrera[] = [];
  newCarrera = '';
  duracion = '';

  loading = false;
  error: string | null = null;
  success: string | null = null;

  displayedColumns = ['nombre', 'duracion', 'acciones'];

  constructor(private carreraService: CarreraService) { }

  ngOnInit() {
    this.loadCarreras();
  }

  async loadCarreras() {
    this.loading = true;
    this.error = null;
    try {
      this.carreras = await this.carreraService.getAll();
    } catch (error) {
      console.error('Error al cargar carreras:', error);
      this.error = 'Error al cargar las carreras de la base de datos';
    } finally {
      this.loading = false;
    }
  }

  async crearCarrera() {
    if (!this.newCarrera) {
      this.error = 'Por favor complete el nombre de la carrera';
      return;
    }

    this.loading = true;
    this.error = null;

    const nuevaCarrera: Carrera = {
      nombre: this.newCarrera,
      semestres: this.duracion ? Number(this.duracion) : undefined
    };

    try {
      await this.carreraService.create(nuevaCarrera);
      this.success = 'Carrera creada correctamente';
      this.clearForm();
      await this.loadCarreras();
    } catch (error) {
      console.error('Error al crear carrera:', error);
      this.error = 'Error al crear la carrera';
    } finally {
      this.loading = false;
    }
  }

  async eliminarCarrera(carrera: Carrera) {
    if (!confirm('¿Está seguro de eliminar esta carrera?')) {
      return;
    }

    if (!carrera.id) return;

    this.loading = true;
    this.error = null;

    try {
      await this.carreraService.delete(carrera.id);
      this.success = 'Carrera eliminada correctamente';
      await this.loadCarreras();
    } catch (error) {
      console.error('Error al eliminar carrera:', error);
      this.error = 'Error al eliminar la carrera';
    } finally {
      this.loading = false;
    }
  }

  clearForm() {
    this.newCarrera = '';
    this.duracion = '';
  }

  handleCloseAlert() {
    this.error = null;
    this.success = null;
  }
}
