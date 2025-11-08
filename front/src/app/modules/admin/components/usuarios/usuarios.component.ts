import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../../../services/api/usuario.service';
import { Usuario } from '../../../../models';

export type UserRole = 'Alumno' | 'Jefe de Grupo' | 'Checador' | 'Maestro' | 'Administrador';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];

  tabValue = 0;
  accountNumber = '';
  userName = '';
  email = '';
  password = '';
  role: UserRole = 'Alumno';
  searchAccount = '';
  numeroCuenta = '';

  loading = false;
  error: string | null = null;
  success: string | null = null;
  selectedUser: Usuario | null = null;

  roles: UserRole[] = [
    'Alumno',
    'Jefe de Grupo',
    'Checador',
    'Maestro',
    'Administrador'
  ];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.loadUsuarios();
  }

  async loadUsuarios() {
    this.loading = true;
    this.error = null;
    try {
      this.usuarios = await this.usuarioService.getAll();
    } catch (error) {
      this.error = 'Error al cargar los usuarios de la base de datos';
    } finally {
      this.loading = false;
    }
  }
  
  onTabChange(event: any) {
    this.tabValue = event.index;
    if (event.index === 0) {
      this.clearForm();
    }
  }

  clearForm() {
    this.accountNumber = '';
    this.userName = '';
    this.email = '';
    this.password = '';
    this.role = 'Alumno';
    this.searchAccount = '';
    this.selectedUser = null;
    this.numeroCuenta = '';
  }

  async handleSearch() {
    if (!this.searchAccount) {
      this.error = 'Por favor ingrese un número de cuenta para buscar';
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const user = this.usuarios.find(u => 
        u.numero_cuenta === this.searchAccount || 
        u.id === Number(this.searchAccount)
      );

      if (user) {
        this.setUserData(user);
        this.success = 'Usuario encontrado';
      } else {
        this.error = 'Usuario no encontrado';
        this.clearForm();
      }
    } catch (error) {
      this.error = 'Error al buscar el usuario';
    } finally {
      this.loading = false;
    }
  }

  setUserData(user: Usuario) {
    this.selectedUser = user;
    this.accountNumber = user.id?.toString() || '';
    this.userName = user.name;
    this.email = user.email || '';
    this.password = '';
    this.role = (user.role as UserRole) || 'Alumno';
    this.numeroCuenta = user.numero_cuenta || '';
  }

  async handleSave() {
    if (!this.selectedUser) {
      this.error = 'Primero debe buscar un usuario';
      return;
    }

    if (!this.userName || !this.email) {
      this.error = 'Complete todos los campos requeridos';
      return;
    }

    this.loading = true;
    this.error = null;

    const usuarioActualizado: Partial<Usuario> = {
      name: this.userName,
      email: this.email,
      role: this.role,
      numero_cuenta: this.numeroCuenta
    };

    if (this.password) {
      usuarioActualizado.password = this.password;
    }

    try {
      await this.usuarioService.update(this.selectedUser.id!, usuarioActualizado);
      this.success = 'Usuario actualizado correctamente';
      this.password = '';
      await this.loadUsuarios();
    } catch (error) {
      this.error = 'Error al actualizar el usuario';
    } finally {
      this.loading = false;
    }
  }

  async handleDelete() {
    if (!this.selectedUser) {
      this.error = 'Primero debe buscar un usuario';
      return;
    }

    if (!confirm('¿Está seguro de eliminar este usuario?')) {
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      await this.usuarioService.delete(this.selectedUser.id!);
      this.success = 'Usuario eliminado correctamente';
      this.clearForm();
      await this.loadUsuarios();
    } catch (error) {
      this.error = 'Error al eliminar el usuario';
    } finally {
      this.loading = false;
    }
  }

  async handleAddUser() {
    if (!this.userName || !this.email || !this.password) {
      this.error = 'Por favor complete el nombre, correo electrónico y contraseña';
      return;
    }

    this.loading = true;
    this.error = null;

    const newUser: Usuario = {
      name: this.userName,
      email: this.email,
      password: this.password,
      role: this.role,
      numero_cuenta: this.numeroCuenta
    };

    try {
      await this.usuarioService.create(newUser);
      this.success = 'Usuario creado correctamente';
      this.clearForm();
      await this.loadUsuarios();
    } catch (error) {
      this.error = 'Error al crear el usuario';
    } finally {
      this.loading = false;
    }
  }

  handleCloseAlert() {
    this.error = null;
    this.success = null;
  }
}
