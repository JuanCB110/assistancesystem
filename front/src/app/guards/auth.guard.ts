import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser;

  // Si NO hay usuario, redirigir a login
  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }

  // Si hay usuario, permitir acceso
  return true;
};
