import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser;

  // Si ya está autenticado, redirigir según su rol
  if (currentUser) {
    const roleRoutes: { [key: string]: string } = {
      'Administrador': '/admin/dashboard',
      'Alumno': '/alumno/horario',
      'Jefe_de_Grupo': '/jefe/horario',
      'Checador': '/checador/control-asistencia',
      'Maestro': '/maestro/horario'
    };
    
    const targetRoute = roleRoutes[currentUser.role] || '/admin/dashboard';
    router.navigate([targetRoute]);
    return false;
  }

  // Si NO está autenticado, permitir acceso al login
  return true;
};
