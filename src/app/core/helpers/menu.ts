export interface MenuItem {
  label: string;
  icon: string;
  iconActive: string;
  route?: string;
  roles: string[];
  children?: MenuItem[];
  expanded?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'assets/icons/dashboard.png',
    iconActive: 'assets/icons/dashboard-blue.png',
    route: '/dashboard',
    roles: ['ADMIN'],
  },
];
