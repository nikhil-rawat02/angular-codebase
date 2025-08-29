import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation, withPreloading } from '@angular/router';
import { PreloadAllModules } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DatePipe } from '@angular/common';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes, 
      withHashLocation(),  // Enables hash-based routing (# in URLs)
      withPreloading(PreloadAllModules) // Preloads lazy-loaded modules
    ),
    DatePipe,
    // provideStore({ userState: storeReducer }), // Register the NgRx store
    // provideStoreDevtools({ maxAge: 25, logOnly: false }), // Enable Redux DevTools
    provideHttpClient(withInterceptors([authInterceptor])), // Injecting Auth Interceptor
    provideToastr(), // Adding ngx-toastr provider
    provideAnimations(), // Required for ngx-toastr animations
    importProvidersFrom(NgxDaterangepickerMd.forRoot()) // Importing NgxDaterangepicker
  ]
};
