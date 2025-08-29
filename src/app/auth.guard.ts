import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthServiceCore } from './core/services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  const router = inject(Router);
  const authService = inject(AuthServiceCore);

  const token = authService.getToken();
  const decodedToken = authService.decodeToken();
  // const userRole = localStorage.getItem('ut');
    
  // Redirect to login if token is missing or invalid
  if (!token || !decodedToken) {    
    return router.createUrlTree(['/login']);
  }

  // Check if token is expired
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
