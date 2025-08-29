import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServiceCore } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{ 
  private AuthServiceCore = inject(AuthServiceCore);

  ngOnInit(): void {
    if (this.AuthServiceCore.isAuthenticated()) {
      this.AuthServiceCore.startTokenExpiryTimer();
    } else {
      this.AuthServiceCore.clearToken();
    }
  }
}
