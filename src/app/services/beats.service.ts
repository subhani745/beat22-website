// src/app/services/beats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BeatsService {
  private apiUrl = 'https://api-server.illpeoplemusic.com/api/v2/playlist/trending';

  constructor(private http: HttpClient) {}

  getBeats(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
