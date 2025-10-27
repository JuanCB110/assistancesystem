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
    console.log('navigateByRole llamado con rol:', role);
    console.log('Tipo de rol:', typeof role);
    
    // Normalizar el rol para comparación
    const normalizedRole = role?.trim();
    
    const roleRoutes: { [key: string]: string } = {
      'Administrador': '/admin/dashboard',
      'Alumno': '/alumno/horario',
      'Jefe_de_Grupo': '/jefe/horario',
      'Jefe de Grupo': '/jefe/horario', // Variante con espacio
      'Checador': '/checador/control-asistencia',
      'Maestro': '/maestro/horario'
    };
    
    const targetRoute = roleRoutes[normalizedRole];
    console.log('Ruta encontrada:', targetRoute);
    
    if (!targetRoute) {
      console.warn('⚠️ No se encontró ruta para el rol:', normalizedRole);
      console.log('Roles disponibles:', Object.keys(roleRoutes));
      // Si no encuentra el rol, ir a login en lugar de admin
      this.router.navigate(['/login']);
      return;
    }
    
    console.log('✅ Navegando a:', targetRoute);
    this.router.navigate([targetRoute]);
  }

  // Método para establecer usuario
  setUser(user: User): void {
    this.userSubject.next(user);
    try {
      localStorage.setItem('user_data', JSON.stringify(user));
    } catch (error) {
      console.error('Error al guardar usuario en localStorage:', error);
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

      console.log('Usuario recibido del backend:', user);
      console.log('Rol del usuario:', user.role);

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
        console.error('Error al actualizar rol:', error);
      }
    }
  }

  // Método signOut - regresar al login
  async signOut(): Promise<void> {
    console.log('Cerrando sesión...');
    
    // Limpiar el estado del usuario
    this.userSubject.next(null);
    
    // Limpiar localStorage
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_token');
    
    console.log('Usuario y tokens eliminados');
    
    // Navegar al login
    await this.router.navigate(['/login']);
    
    console.log('Navegado a login');
  }
}
