import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService, User } from '../../../../services/auth.service';

interface MenuItem {
  text: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {
  userName = 'Admin';

  menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: 'fa-tachometer-alt', path: '/admin/dashboard' },
    { text: 'Gestión de Horarios', icon: 'fa-calendar-alt', path: '/admin/horarios' },
    { text: 'Consulta de Horarios', icon: 'fa-clock', path: '/admin/horario' },
    { text: 'Grupos', icon: 'fa-users', path: '/admin/grupos' },
    { text: 'Usuarios', icon: 'fa-user', path: '/admin/usuarios' },
    { text: 'Materias', icon: 'fa-book', path: '/admin/materias' },
    { text: 'Carreras', icon: 'fa-graduation-cap', path: '/admin/carreras' },
    // { text: 'Temario', icon: 'fa-bookmark', path: '/admin/temarios' },
    { text: 'Edificios', icon: 'fa-building', path: '/admin/edificios' },
    { text: 'Aulas', icon: 'fa-door-open', path: '/admin/aulas' },
    { text: 'Consulta de Asistencias', icon: 'fa-clipboard-check', path: '/admin/consulta-asistencias' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Obtener el nombre del usuario
    const user = this.authService.currentUser;
    if (user && user.email) {
      this.userName = user.email.split('@')[0];
    }
  }

  async signOut() {
    await this.authService.signOut();
  }
}
