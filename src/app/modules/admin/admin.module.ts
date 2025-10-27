import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { GestionHorariosComponent } from './components/gestion-horarios/gestion-horarios.component';
import { ConsultaHorariosComponent } from './components/consulta-horarios/consulta-horarios.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { MateriasComponent } from './components/materias/materias.component';
import { CarrerasComponent } from './components/carreras/carreras.component';
import { EdificiosComponent } from './components/edificios/edificios.component';
// import { TemariosComponent } from './components/temarios/temarios.component';
import { ConsultaAsistenciasComponent } from './components/consulta-asistencias/consulta-asistencias.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    AdminLayoutComponent,
    AdminSidebarComponent,
    AdminDashboardComponent,
    GestionHorariosComponent,
    ConsultaHorariosComponent,
    UsuariosComponent,
    GruposComponent,
    MateriasComponent,
    CarrerasComponent,
    EdificiosComponent,
    // TemariosComponent,
    ConsultaAsistenciasComponent
  ]
})
export class AdminModule { }
