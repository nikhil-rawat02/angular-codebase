import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AppService } from '../../../app.service';
import { ToastrService } from 'ngx-toastr';
import { MENU_ITEMS, MenuItem } from '../../../core/helpers/menu';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('submenu', [
      state(
        'closed',
        style({
          height: '0',
          opacity: 0,
          overflow: 'hidden',
          paddingTop: '0',
          paddingBottom: '0',
        })
      ),
      state(
        'open',
        style({
          height: '*',
          opacity: 1,
          overflow: 'hidden',
          paddingTop: '*',
          paddingBottom: '*',
        })
      ),
      transition(
        'closed <=> open',
        animate('350ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  userRole: string = '';
  userProfile: any;
  @Input() isOpen: boolean = true;

  constructor(
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userRole = decodedToken.role;
    }
  }

  ngOnInit(): void {
    this.fetchUserProfile();
    this.menuItems = MENU_ITEMS;

    // TODO: apply this 
    // this.menuItems = MENU_ITEMS.filter((item) =>
    //   item.roles.includes(this.userRole)
    // );
  }

  fetchUserProfile() {
    // this.appService.fetchUserProfile().subscribe({
    //   next: (res: any) => {
    //     this.userProfile = res?.data;
    //   },
    //   error: (error) => {
    //     this.toastr.error(error || 'User profile can not be loaded!', 'Error');
    //   },
    // });
  }

  // toggleMenu(item: MenuItem): void {
  //   this.menuItems.forEach((menu) => {
  //     if (menu !== item) {
  //       menu['expanded'] = false;
  //     }
  //   });
  //   item['expanded'] = !item['expanded'];
  // }

  submenuAnimating = false;

  toggleMenu(item: any): void {
    if (this.submenuAnimating) return; // prevent toggle while animating

    this.menuItems.forEach((menu) => {
      if (menu !== item && menu.expanded) {
        menu.expanded = false;
      }
    });

    item.expanded = !item.expanded;
    this.submenuAnimating = true;
  }

  onAnimationDone(event: any, item: any): void {
    this.submenuAnimating = false;
  }
}
