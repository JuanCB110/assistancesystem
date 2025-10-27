import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { GestionHorariosComponent } from './components/gestion-horarios/gestion-horarios.component';
import { ConsultaHorariosComponent } from './components/consulta-horarios/consulta-horarios.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { MateriasComponent } from './components/materias/materias.component';
import { CarrerasComponent } from './components/carreras/carreras.component';
import { EdificiosComponent } from './components/edificios/edificios.component';
import { AulasComponent } from './components/aulas/aulas.component';
// import { TemariosComponent } from './components/temarios/temarios.component';
import { ConsultaAsistenciasComponent } from './components/consulta-asistencias/consulta-asistencias.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'horarios', component: GestionHorariosComponent },
      { path: 'horario', component: ConsultaHorariosComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'grupos', component: GruposComponent },
      { path: 'materias', component: MateriasComponent },
      { path: 'carreras', component: CarrerasComponent },
      // { path: 'temarios', component: TemariosComponent },
      { path: 'edificios', component: EdificiosComponent },
      { path: 'aulas', component: AulasComponent },
      { path: 'consulta-asistencias', component: ConsultaAsistenciasComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
