import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ConfigService } from '../../core/services/config.service';
import type { Observable } from 'rxjs';
import { API } from '../../core/helpers/api-constants';
import { Router } from '@angular/router';
import { CONSTANTS } from '../../core/helpers/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly router = inject(Router);

  private readonly apiUrl: string = this.configService.apiUrl;

  login(request: { username: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl + API.LOGIN, request);
  }

  confirmOtp(request: {
    username: string;
    password: string;
    otp: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl + API.LOGIN, request);
  }

  logout(): void {
    const storage = localStorage.getItem(CONSTANTS.TOKEN)
      ? localStorage
      : sessionStorage;
    storage.removeItem(CONSTANTS.TOKEN);
    storage.removeItem(CONSTANTS.USER_DATA);
    storage.removeItem('ums-roles');
    storage.removeItem('ums-privilege-list');

    this.router.navigate(['/login']);
  }
}
