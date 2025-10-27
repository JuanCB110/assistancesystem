import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JefeLayoutComponent } from './components/jefe-layout/jefe-layout.component';
import { JefeHorarioComponent } from './components/jefe-horario/jefe-horario.component';
import { JefeDashboardComponent } from './components/jefe-dashboard/jefe-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: JefeLayoutComponent,
    children: [
      { path: '', redirectTo: 'horario', pathMatch: 'full' },
      { path: 'horario', component: JefeHorarioComponent },
      { path: 'dashboard', component: JefeDashboardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JefeRoutingModule { }
