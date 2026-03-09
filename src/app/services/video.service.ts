import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:3000/api/video';

  getVideosByCategory(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?slug=${slug}`);
  }

  getLatestVideo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/latest`);
  }

  getVideoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
