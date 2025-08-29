import type {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn} from '@angular/common/http';
import {
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../app.service';
import { CONSTANTS } from '../helpers/constants';
import { AuthService } from '../../pages/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const appService = inject(AppService);
  const toastr = inject(ToastrService);
  const authService = inject(AuthService);

  let accessToken = localStorage.getItem(CONSTANTS.TOKEN) || sessionStorage.getItem(CONSTANTS.TOKEN);
  const refreshToken = localStorage.getItem(CONSTANTS.REFRESH_TOKEN);

  // Skip interceptor for refresh token API request
  if (req.url.includes('token/refresh/admin')) {
    return next(req);
  }

  // Attach Authorization header if token exists
  if (accessToken) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(req).pipe(
    switchMap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        if(event.body?.errorCode === 109){
          authService.logout();
          return throwError(() => new Error('Another login was detected using your credentials. Your session has been terminated to protect your account.'));
        }
        else if (event.body?.result === 'error' && (event.body?.errorCode === 110)) {
          // Token expired, attempt to refresh
          return refreshAccessToken(appService, refreshToken!).pipe(
            switchMap((response: any) => {
              if (response.result === 'error') {
                authService.logout();
                return throwError(() => new Error('Session expired. Please log in again.'));
              }              

              // Store new tokens
              localStorage.setItem(CONSTANTS.TOKEN, response.data.accessToken);
              localStorage.setItem(CONSTANTS.REFRESH_TOKEN, response.data.refreshToken);

              // Retry the original request with the new token
              const clonedReq = req.clone({
                setHeaders: { Authorization: `Bearer ${response.data.accessToken}` },
              });
              return next(clonedReq);
            }),
            catchError(() => {
              authService.logout();
              toastr.error('Another login was detected using your credentials. Your session has been terminated to protect your account.', 'Error');
              return throwError(() => new Error('Session expired. Please log in again.'));
            })
          );
        }
      }
      return new Observable<HttpEvent<any>>((observer) => {
        observer.next(event);
        observer.complete();
      });
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && refreshToken) {
        return refreshAccessToken(appService, refreshToken).pipe(
          switchMap((response: any) => {
            if (response.result === 'error' && response.errorCode === 110) {
              // logout(router);
              return throwError(() => new Error('Session expired. Please log in again.'));
            }

            // Store new tokens
            localStorage.setItem(CONSTANTS.TOKEN, response.data.accessToken);
            localStorage.setItem(CONSTANTS.REFRESH_TOKEN, response.data.refreshToken);

            // Retry the original request with the new token
            const clonedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${response.data.accessToken}` },
            });
            return next(clonedReq);
          }),
          catchError(() => {
            // logout(router);
            return throwError(() => new Error('Session expired. Please log in again.'));
          })
        );
      }
      return throwError(() => error);
    })
  );
};



// Refresh the access token
function refreshAccessToken(appService: AppService, refreshToken: string): Observable<any> {
  return appService.refreshAccessToken(refreshToken);
}
