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
import { MatTooltipModule } from '@angular/material/tooltip';
import { EdificioService } from '../../../../services/api/edificio.service';
import { Edificio } from '../../../../models';
import { ToastService } from '../../../../services/toast.service';

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
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './edificios.component.html',
  styleUrls: ['./edificios.component.css']
})
export class EdificiosComponent implements OnInit {
  edificios: Edificio[] = [];
  edificiosFiltrados: Edificio[] = [];
  newEdificio = '';
  showForm = false;
  isEditing = false;
  searchTerm = '';
  selectedEdificio: Edificio | null = null;
  loading = false;
  displayedColumns = ['nombre', 'acciones'];

  constructor(
    private edificioService: EdificioService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadEdificios();
  }

  async loadEdificios() {
    this.loading = true;
    try {
      this.edificios = await this.edificioService.getAll();
      this.edificiosFiltrados = [...this.edificios];
    } catch (error) {
      this.toastService.show('Error al cargar los edificios', 'error');
    } finally {
      this.loading = false;
    }
  }

  filterEdificios() {
    const term = this.searchTerm.toLowerCase();
    this.edificiosFiltrados = this.edificios.filter(e =>
      e.nombre?.toLowerCase().includes(term)
    );
  }

  openForm(edificio?: Edificio) {
    if (edificio) {
      this.isEditing = true;
      this.selectedEdificio = edificio;
      this.newEdificio = edificio.nombre || '';
    } else {
      this.isEditing = false;
      this.selectedEdificio = null;
      this.clearForm();
    }
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.isEditing = false;
    this.selectedEdificio = null;
    this.clearForm();
  }

  async crearEdificio() {
    if (!this.newEdificio) {
      this.toastService.show('Por favor ingrese el nombre del edificio', 'warning');
      return;
    }

    this.loading = true;

    const edificioData: Edificio = {
      nombre: this.newEdificio,
    };

    try {
      if (this.isEditing && this.selectedEdificio?.id) {
        await this.edificioService.update(this.selectedEdificio.id, edificioData);
        this.toastService.show('Edificio actualizado correctamente', 'success');
      } else {
        await this.edificioService.create(edificioData);
        this.toastService.show('Edificio creado correctamente', 'success');
      }
      this.closeForm();
      await this.loadEdificios();
    } catch (error) {
      this.toastService.show(`Error al ${this.isEditing ? 'actualizar' : 'crear'} el edificio`, 'error');
    } finally {
      this.loading = false;
    }
  }

  confirmDelete(edificio: Edificio) {
    if (confirm(`¿Está seguro de eliminar el edificio "${edificio.nombre}"?`)) {
      this.eliminarEdificio(edificio);
    }
  }

  async eliminarEdificio(edificio: Edificio) {
    if (!edificio.id) return;

    this.loading = true;

    try {
      await this.edificioService.delete(edificio.id);
      this.toastService.show('Edificio eliminado correctamente', 'success');
      await this.loadEdificios();
    } catch (error) {
      this.toastService.show('Error al eliminar el edificio', 'error');
    } finally {
      this.loading = false;
    }
  }

  clearForm() {
    this.newEdificio = '';
    this.selectedEdificio = null;
  }
}
