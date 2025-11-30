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
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AulaService } from '../../../../services/api/aula.service';
import { EdificioService } from '../../../../services/api/edificio.service';
import { Aula, Edificio } from '../../../../models';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-aulas',
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
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {
  aulas: Aula[] = [];
  aulasFiltradas: Aula[] = [];
  edificios: Edificio[] = [];
  newAula = '';
  selectedEdificioId = '';
  showForm = false;
  isEditing = false;
  searchTerm = '';
  selectedAula: Aula | null = null;
  loading = false;
  displayedColumns = ['numero', 'edificio', 'acciones'];

  constructor(
    private aulaService: AulaService,
    private edificioService: EdificioService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadAulas();
    this.loadEdificios();
  }

  async loadEdificios() {
    try {
      this.edificios = await this.edificioService.getAll();
    } catch (error) {
      // Error al cargar edificios
    }
  }

  async loadAulas() {
    this.loading = true;
    try {
      this.aulas = await this.aulaService.getAll();
      this.aulasFiltradas = [...this.aulas];
    } catch (error) {
      this.toastService.show('Error al cargar las aulas', 'error');
    } finally {
      this.loading = false;
    }
  }

  filterAulas() {
    const term = this.searchTerm.toLowerCase();
    this.aulasFiltradas = this.aulas.filter(a =>
      a.numero?.toLowerCase().includes(term) ||
      this.getEdificioNombre(a.edificio_id).toLowerCase().includes(term)
    );
  }

  openForm(aula?: Aula) {
    if (aula) {
      this.isEditing = true;
      this.selectedAula = aula;
      this.newAula = aula.numero || '';
      this.selectedEdificioId = aula.edificio_id?.toString() || '';
    } else {
      this.isEditing = false;
      this.selectedAula = null;
      this.clearForm();
    }
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.isEditing = false;
    this.selectedAula = null;
    this.clearForm();
  }

  async crearAula() {
    if (!this.newAula || !this.selectedEdificioId) {
      this.toastService.show('Por favor complete todos los campos', 'warning');
      return;
    }

    this.loading = true;

    const aulaData: Aula = {
      numero: this.newAula,
      edificio_id: Number(this.selectedEdificioId)
    };

    try {
      if (this.isEditing && this.selectedAula?.id) {
        await this.aulaService.update(this.selectedAula.id, aulaData);
        this.toastService.show('Aula actualizada correctamente', 'success');
      } else {
        await this.aulaService.create(aulaData);
        this.toastService.show('Aula creada correctamente', 'success');
      }
      this.closeForm();
      await this.loadAulas();
    } catch (error) {
      this.toastService.show(`Error al ${this.isEditing ? 'actualizar' : 'crear'} el aula`, 'error');
    } finally {
      this.loading = false;
    }
  }

  confirmDelete(aula: Aula) {
    if (confirm(`¿Está seguro de eliminar el aula "${aula.numero}"?`)) {
      this.eliminarAula(aula);
    }
  }

  async eliminarAula(aula: Aula) {
    if (!confirm('¿Está seguro de eliminar esta aula?')) {
      return;
    }

    if (!aula.id) return;

    this.loading = true;
    this.error = null;

    try {
      await this.aulaService.delete(aula.id);
      this.success = 'Aula eliminada correctamente';
      await this.loadAulas();
    } catch (error) {
      this.error = 'Error al eliminar el aula';
    } finally {
      this.loading = false;
    }
  }

  clearForm() {
    this.newAula = '';
    this.selectedEdificioId = '';
    this.selectedAula = null;
  }

  getEdificioNombre(edificioId?: number): string {
    if (!edificioId) return 'N/A';
    const edificio = this.edificios.find(e => e.id === edificioId);
    return edificio?.nombre || 'N/A';
  }
}
