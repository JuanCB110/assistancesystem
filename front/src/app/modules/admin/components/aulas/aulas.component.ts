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
import { AulaService } from '../../../../services/api/aula.service';
import { EdificioService } from '../../../../services/api/edificio.service';
import { Aula, Edificio } from '../../../../models';

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
    MatSelectModule
  ],
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {
  aulas: Aula[] = [];
  edificios: Edificio[] = [];
  newAula = '';
  selectedEdificio = '';
  loading = false;
  error: string | null = null;
  success: string | null = null;
  displayedColumns = ['numero', 'edificio', 'acciones'];

  constructor(
    private aulaService: AulaService,
    private edificioService: EdificioService
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
    this.error = null;
    try {
      this.aulas = await this.aulaService.getAll();
    } catch (error) {
      this.error = 'Error al cargar las aulas de la base de datos';
    } finally {
      this.loading = false;
    }
  }

  async crearAula() {
    if (!this.newAula || !this.selectedEdificio) {
      this.error = 'Por favor complete todos los campos';
      return;
    }

    this.loading = true;
    this.error = null;

    const nuevaAula: Aula = {
      numero: this.newAula,
      edificio_id: Number(this.selectedEdificio)
    };

    try {
      await this.aulaService.create(nuevaAula);
      this.success = 'Aula creada correctamente';
      this.clearForm();
      await this.loadAulas();
    } catch (error) {
      this.error = 'Error al crear el aula';
    } finally {
      this.loading = false;
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
    this.selectedEdificio = '';
  }

  getEdificioNombre(edificioId?: number): string {
    if (!edificioId) return 'N/A';
    const edificio = this.edificios.find(e => e.id === edificioId);
    return edificio?.nombre || 'N/A';
  }

  handleCloseAlert() {
    this.error = null;
    this.success = null;
  }
}
