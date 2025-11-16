import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-maestro-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './maestro-layout.component.html',
  styleUrl: './maestro-layout.component.css'
})
export class MaestroLayoutComponent {
  userName: string = '';

  constructor(private authService: AuthService) {
    const user = this.authService.currentUser;
    this.userName = user?.name || 'Profesor';
  }

  async signOut() {
    await this.authService.signOut();
  }
}
