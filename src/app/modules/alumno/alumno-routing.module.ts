import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnoLayoutComponent } from './components/alumno-layout/alumno-layout.component';
import { AlumnoHorarioComponent } from './components/alumno-horario/alumno-horario.component';
import { AlumnoDashboardComponent } from './components/alumno-dashboard/alumno-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AlumnoLayoutComponent,
    children: [
      { path: 'horario', component: AlumnoHorarioComponent },
      { path: 'dashboard', component: AlumnoDashboardComponent },
      { path: '', redirectTo: 'horario', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnoRoutingModule { }
