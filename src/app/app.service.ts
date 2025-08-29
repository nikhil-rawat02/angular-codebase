import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './core/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.apiUrl;
  }


}
