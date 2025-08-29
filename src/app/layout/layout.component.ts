import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, CommonModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  animations: [
    trigger('sidebarSlide', [
      state('open', style({ transform: 'translateX(0)' })),
      state('closed', style({ transform: 'translateX(-100%)' })),
      transition('open <=> closed', animate('300ms ease-in-out')),
    ])
  ]
})
export class LayoutComponent {
  sidebarOpen = false;
  screenWidth = window.innerWidth;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenWidth = (event.target as Window).innerWidth;
    if (this.screenWidth >= 768) {
      this.sidebarOpen = true; // always show on medium+ screens
    } else {
      this.sidebarOpen = false; // hide on small screens
    }
  }

  ngOnInit() {
    this.sidebarOpen = this.screenWidth >= 768;
  }
}
