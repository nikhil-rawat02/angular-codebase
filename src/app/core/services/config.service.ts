import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any = {};
  private basehref: string = environment.baseHref;

  async loadConfig() {
    try {      
      const response = await fetch(`${this.basehref}assets/config.json?v=${new Date().getTime()}`);
      this.config = await response.json();
    } catch (error) {
      console.error('Failed to load config.json', error);
      this.config = {};
    }
  }

  get apiUrl(): string {
    return this.config.apiUrl?.trim() ? this.config.apiUrl : environment.apiUrl;
  }
}
