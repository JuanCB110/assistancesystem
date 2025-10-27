import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-checador-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './checador-sidebar.component.html',
  styleUrls: ['./checador-sidebar.component.css']
})
export class ChecadorSidebarComponent implements OnInit {
  userName: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser;
    if (user) {
      this.userName = user.name || 'Usuario';
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  async logout() {
    await this.authService.signOut();
  }
}
