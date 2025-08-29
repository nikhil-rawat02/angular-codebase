import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CONSTANTS } from '../helpers/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceCore {
  private router = inject(Router);
  
  private tokenKey = CONSTANTS.TOKEN;
  private expiryTimer: any;

  // Get token from localStorage
  getToken(): string | null {
    return sessionStorage.getItem(CONSTANTS.TOKEN);
  }

  // Decode JWT token
  decodeToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Invalid Token:', error);
        return null;
      }
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {    
    const decodedToken = this.decodeToken();
    if (!decodedToken) return false;

    return true;
  }

  startTokenExpiryTimer(): void {
    const decoded = this.decodeToken();
    if (!decoded?.exp) return;

    const now = Math.floor(Date.now() / 1000);
    const expiryInMs = (decoded.exp - now) * 1000;
    
    if (expiryInMs > 0) {
      this.expiryTimer = setTimeout(() => {        
        this.clearToken();
        this.router.navigate(['/login']);
      }, expiryInMs);
    } else {
      this.clearToken();
    }
  }

  clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
    if (this.expiryTimer) {      
      clearTimeout(this.expiryTimer);
      this.expiryTimer = null;
    }
  }

}
