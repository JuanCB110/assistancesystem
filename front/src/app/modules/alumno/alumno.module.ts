import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AlumnoRoutingModule } from './alumno-routing.module';
import { AlumnoLayoutComponent } from './components/alumno-layout/alumno-layout.component';
import { AlumnoHorarioComponent } from './components/alumno-horario/alumno-horario.component';
import { AlumnoDashboardComponent } from './components/alumno-dashboard/alumno-dashboard.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AlumnoRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    AlumnoLayoutComponent,
    AlumnoHorarioComponent,
    AlumnoDashboardComponent
  ]
})
export class AlumnoModule { }
