import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AlumnoSidebarComponent } from '../alumno-sidebar/alumno-sidebar.component';

@Component({
  selector: 'app-alumno-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AlumnoSidebarComponent
  ],
  templateUrl: './alumno-layout.component.html',
  styleUrls: ['./alumno-layout.component.css']
})
export class AlumnoLayoutComponent {
  constructor() { }
}
