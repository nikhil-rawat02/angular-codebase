import { Component, EventEmitter, inject, Output } from '@angular/core';
import { routerMap } from '../../../core/helpers/router-map';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { AuthService } from '../../../pages/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  currentRoute = '';
  routeMap: any = routerMap;
  isModalOpen = false;
  loading = false;

  @Output() toggleSidebar = new EventEmitter<boolean>();

  handleLogout = ():void => {
   this.authService.logout();
  }

  // Actions Handlers
  onToggle(): void {
    this.toggleSidebar.emit();
  }

  onLogout(): void {
    this.isModalOpen= true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
