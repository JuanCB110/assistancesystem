import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChecadorLayoutComponent } from './components/checador-layout/checador-layout.component';
import { ControlAsistenciaComponent } from './components/control-asistencia/control-asistencia.component';

const routes: Routes = [
  {
    path: '',
    component: ChecadorLayoutComponent,
    children: [
      { path: 'control-asistencia', component: ControlAsistenciaComponent },
      { path: '', redirectTo: 'control-asistencia', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChecadorRoutingModule { }
