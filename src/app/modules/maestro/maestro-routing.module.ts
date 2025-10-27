import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaestroLayoutComponent } from './components/maestro-layout/maestro-layout.component';
import { MaestroDashboardComponent } from './components/maestro-dashboard/maestro-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: MaestroLayoutComponent,
    children: [
      { path: 'dashboard', component: MaestroDashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaestroRoutingModule { }
