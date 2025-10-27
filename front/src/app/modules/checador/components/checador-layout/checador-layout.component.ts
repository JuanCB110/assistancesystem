import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChecadorSidebarComponent } from '../checador-sidebar/checador-sidebar.component';

@Component({
  selector: 'app-checador-layout',
  standalone: true,
  imports: [RouterOutlet, ChecadorSidebarComponent],
  templateUrl: './checador-layout.component.html',
  styleUrl: './checador-layout.component.css'
})
export class ChecadorLayoutComponent {

}
