import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-jefe-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './jefe-layout.component.html',
  styleUrls: ['./jefe-layout.component.css']
})
export class JefeLayoutComponent {

  constructor(private authService: AuthService) { }

  async signOut() {
    await this.authService.signOut();
  }
}
