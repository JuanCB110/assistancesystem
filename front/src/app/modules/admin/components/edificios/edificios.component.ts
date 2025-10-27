import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { EdificioService } from '../../../../services/api/edificio.service';
import { Edificio } from '../../../../models';

@Component({
  selector: 'app-edificios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './edificios.component.html',
  styleUrls: ['./edificios.component.css']
})
export class EdificiosComponent implements OnInit {
  edificios: Edificio[] = [];
  newEdificio = '';
  loading = false;
  displayedColumns = ['nombre', 'acciones'];

  error: string | null = null;
  success: string | null = null;

  constructor(private edificioService: EdificioService) { }

  ngOnInit() {
    this.loadEdificios();
  }

  async loadEdificios() {
    this.loading = true;
    this.error = null;
    try {
      this.edificios = await this.edificioService.getAll();
    } catch (error) {
      console.error('Error al cargar edificios:', error);
      this.error = 'Error al cargar los edificios de la base de datos';
    } finally {
      this.loading = false;
    }
  }

  async crearEdificio() {
    if (!this.newEdificio) {
      this.error = 'Por favor ingrese el nombre del edificio';
      return;
    }

    this.loading = true;
    this.error = null;

    const nuevoEdificio: Edificio = {
      nombre: this.newEdificio,
    };

    try {
      await this.edificioService.create(nuevoEdificio);
      this.success = 'Edificio creado correctamente';
      this.clearForm();
      await this.loadEdificios();
    } catch (error) {
      console.error('Error al crear edificio:', error);
      this.error = 'Error al crear el edificio';
    } finally {
      this.loading = false;
    }
  }

  async eliminarEdificio(edificio: Edificio) {
    if (!confirm('¿Está seguro de eliminar este edificio?')) {
      return;
    }

    if (!edificio.id) return;

    this.loading = true;
    this.error = null;

    try {
      await this.edificioService.delete(edificio.id);
      this.success = 'Edificio eliminado correctamente';
      await this.loadEdificios();
    } catch (error) {
      console.error('Error al eliminar edificio:', error);
      this.error = 'Error al eliminar el edificio';
    } finally {
      this.loading = false;
    }
  }

  clearForm() {
    this.newEdificio = '';
  }

  handleCloseAlert() {
    this.error = null;
    this.success = null;
  }
}
