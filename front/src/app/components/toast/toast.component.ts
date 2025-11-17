import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToastService, Toast } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts" 
           class="toast"
           [ngClass]="'toast-' + toast.type"
           [@slideIn]>
        <div class="toast-content">
          <mat-icon class="toast-icon">
            {{ getIcon(toast.type) }}
          </mat-icon>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="remove(toast.id)">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
    }

    .toast {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 16px;
      display: flex;
      align-items: center;
      min-width: 320px;
      animation: slideIn 0.3s ease-out;
      border-left: 4px solid;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast-success {
      border-left-color: #4caf50;
    }

    .toast-error {
      border-left-color: #f44336;
    }

    .toast-warning {
      border-left-color: #ff9800;
    }

    .toast-info {
      border-left-color: #2196f3;
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .toast-icon {
      color: inherit;
      flex-shrink: 0;
    }

    .toast-success .toast-icon {
      color: #4caf50;
    }

    .toast-error .toast-icon {
      color: #f44336;
    }

    .toast-warning .toast-icon {
      color: #ff9800;
    }

    .toast-info .toast-icon {
      color: #2196f3;
    }

    .toast-message {
      flex: 1;
      font-size: 14px;
      color: #333;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      flex-shrink: 0;
    }

    .toast-close:hover {
      color: #333;
    }

    .toast-close mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    @media (max-width: 768px) {
      .toast-container {
        right: 12px;
        left: 12px;
        max-width: none;
      }

      .toast {
        min-width: auto;
      }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toast$.subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => {
        this.remove(toast.id);
      }, toast.duration);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  }
}
