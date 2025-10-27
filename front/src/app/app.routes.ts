import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard],
    data: { role: 'Administrador' }
  },
  { 
    path: 'alumno', 
    loadChildren: () => import('./modules/alumno/alumno.module').then(m => m.AlumnoModule),
    canActivate: [authGuard],
    data: { role: 'Alumno' }
  },
  { 
    path: 'jefe', 
    loadChildren: () => import('./modules/jefe/jefe.module').then(m => m.JefeModule),
    canActivate: [authGuard],
    data: { role: 'Jefe_de_Grupo' }
  },
  { 
    path: 'checador', 
    loadChildren: () => import('./modules/checador/checador.module').then(m => m.ChecadorModule),
    canActivate: [authGuard],
    data: { role: 'Checador' }
  },
  { 
    path: 'maestro', 
    loadChildren: () => import('./modules/maestro/maestro.module').then(m => m.MaestroModule),
    canActivate: [authGuard],
    data: { role: 'Maestro' }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
