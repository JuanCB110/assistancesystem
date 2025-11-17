import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsuarioService } from '../../../../services/api/usuario.service';
import { ToastService } from '../../../../services/toast.service';
import { Usuario } from '../../../../models';

export type UserRole = 'Alumno' | 'Jefe de Grupo' | 'Checador' | 'Profesor' | 'Administrador';

@Component({
  selector: 'app-usuarios',
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
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  displayedColumns: string[] = ['nombre', 'email', 'rol', 'numero_cuenta', 'acciones'];

  // Formulario
  showForm = false;
  isEditing = false;
  userName = '';
  email = '';
  password = '';
  role: UserRole = 'Alumno';
  numeroCuenta = '';
  selectedUser: Usuario | null = null;

  // Búsqueda
  searchTerm = '';

  loading = false;

  roles: UserRole[] = [
    'Alumno',
    'Jefe de Grupo',
    'Checador',
    'Profesor',
    'Administrador'
  ];

  constructor(
    private usuarioService: UsuarioService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadUsuarios();
  }

  async loadUsuarios() {
    this.loading = true;
    try {
      this.usuarios = await this.usuarioService.getAll();
      this.usuariosFiltrados = [...this.usuarios];
    } catch (error) {
      this.toastService.error('Error al cargar los usuarios');
    } finally {
      this.loading = false;
    }
  }

  filterUsuarios() {
    if (!this.searchTerm.trim()) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(u => 
      u.name.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.numero_cuenta?.includes(term)
    );
  }

  openForm(usuario?: Usuario) {
    if (usuario) {
      this.isEditing = true;
      this.selectedUser = usuario;
      this.userName = usuario.name;
      this.email = usuario.email || '';
      this.role = (usuario.role as UserRole) || 'Alumno';
      this.numeroCuenta = usuario.numero_cuenta || '';
      this.password = '';
    } else {
      this.isEditing = false;
      this.selectedUser = null;
      this.clearForm();
    }
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.clearForm();
  }

  clearForm() {
    this.userName = '';
    this.email = '';
    this.password = '';
    this.role = 'Alumno';
    this.numeroCuenta = '';
    this.selectedUser = null;
  }

  validateNumeroCuenta(event: any) {
    const value = event.target.value;
    event.target.value = value.replace(/[^0-9]/g, '');
    this.numeroCuenta = event.target.value;
  }

  async saveUsuario() {
    // Validaciones
    if (!this.userName.trim()) {
      this.toastService.warning('El nombre es requerido');
      return;
    }

    if (!this.email.trim()) {
      this.toastService.warning('El email es requerido');
      return;
    }

    if (!this.isEditing && !this.password) {
      this.toastService.warning('La contraseña es requerida para nuevos usuarios');
      return;
    }

    if (this.numeroCuenta && !/^\d+$/.test(this.numeroCuenta)) {
      this.toastService.warning('El número de cuenta debe contener solo números');
      return;
    }

    this.loading = true;

    try {
      if (this.isEditing && this.selectedUser) {
        const usuarioActualizado: Partial<Usuario> = {
          name: this.userName,
          email: this.email,
          role: this.role,
          numero_cuenta: this.numeroCuenta
        };

        if (this.password) {
          usuarioActualizado.password = this.password;
        }

        await this.usuarioService.update(this.selectedUser.id!, usuarioActualizado);
        this.toastService.success('Usuario actualizado correctamente');
      } else {
        const newUser: Usuario = {
          name: this.userName,
          email: this.email,
          password: this.password,
          role: this.role,
          numero_cuenta: this.numeroCuenta
        };

        await this.usuarioService.create(newUser);
        this.toastService.success('Usuario creado correctamente');
      }

      await this.loadUsuarios();
      this.closeForm();
    } catch (error) {
      this.toastService.error(this.isEditing ? 'Error al actualizar el usuario' : 'Error al crear el usuario');
    } finally {
      this.loading = false;
    }
  }

  confirmDelete(usuario: Usuario) {
    if (confirm(`¿Está seguro de eliminar al usuario "${usuario.name}"?\n\nEsta acción no se puede deshacer.`)) {
      this.deleteUsuario(usuario);
    }
  }

  async deleteUsuario(usuario: Usuario) {
    this.loading = true;

    try {
      await this.usuarioService.delete(usuario.id!);
      this.toastService.success('Usuario eliminado correctamente');
      await this.loadUsuarios();
    } catch (error) {
      this.toastService.error('Error al eliminar el usuario');
    } finally {
      this.loading = false;
    }
  }
}
