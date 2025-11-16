import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  numero_cuenta?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private apiUrl = 'http://localhost:3000/api';

  public user$ = this.userSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private router: Router) {
    // Cargar usuario de localStorage al iniciar
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      try {
        this.userSubject.next(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user_data');
      }
    }
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  navigateByRole(role: string): void {
    // Normalizar el rol para comparación
    const normalizedRole = role?.trim();
    
    const roleRoutes: { [key: string]: string } = {
      'Administrador': '/admin/dashboard',
      'Alumno': '/alumno/horario',
      'Jefe_de_Grupo': '/jefe/horario',
      'Jefe de Grupo': '/jefe/horario', // Variante con espacio
      'Checador': '/checador/control-asistencia',
      'Profesor': '/maestro/dashboard'
    };
    
    const targetRoute = roleRoutes[normalizedRole];
    
    if (!targetRoute) {
      // Si no encuentra el rol, ir a login en lugar de admin
      this.router.navigate(['/login']);
      return;
    }
    
    this.router.navigate([targetRoute]);
  }

  // Método para establecer usuario
  setUser(user: User): void {
    this.userSubject.next(user);
    try {
      localStorage.setItem('user_data', JSON.stringify(user));
    } catch (error) {
      // Error al guardar usuario en localStorage
    }
  }

  // Login con el backend Express.js
  async login(email: string, password: string): Promise<User> {
    this.loadingSubject.next(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al iniciar sesión');
      }

      const user: User = result.data.user;
      const token = result.data.token;

      // Guardar token
      localStorage.setItem('auth_token', token);

      // Guardar usuario
      this.setUser(user);
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión');
    } finally {
      this.loadingSubject.next(false);
    }
  }

  // Registro con el backend Express.js
  async register(email: string, password: string, name: string, role: string = 'Alumno', numero_cuenta?: string): Promise<User> {
    this.loadingSubject.next(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name, role, numero_cuenta })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al registrar usuario');
      }

      const user: User = result.data;
      this.setUser(user);
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Error al registrar usuario');
    } finally {
      this.loadingSubject.next(false);
    }
  }

  // Método simplificado para cambiar rol (para demo)
  setRole(role: string): void {
    const currentUser = this.currentUser;
    if (currentUser) {
      currentUser.role = role;
      this.userSubject.next(currentUser);
      try {
        localStorage.setItem('user_data', JSON.stringify(currentUser));
      } catch (error) {
        // Error al actualizar rol
      }
    }
  }

  // Método signOut - regresar al login
  async signOut(): Promise<void> {
    // Limpiar el estado del usuario
    this.userSubject.next(null);
    
    // Limpiar localStorage
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_token');
    
    // Navegar al login
    await this.router.navigate(['/login']);
  }
}
