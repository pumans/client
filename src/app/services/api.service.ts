import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Базовий сервіс для HTTP-запитів.
 * Єдина відповідальність: знати де знаходиться API і як до нього звертатись.
 * Всі інші сервіси використовують його замість прямого inject(HttpClient).
 *
 * На сервері (SSR) звертається напряму до бекенду (http://127.0.0.1:3000/api).
 * У браузері використовує відносний шлях /api, який проксіюється через Angular-сервер
 * — це дозволяє роботу з будь-якого домену (включно з Replit).
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  readonly base = isPlatformBrowser(inject(PLATFORM_ID))
    ? '/api'                  // браузер — відносний шлях, проксіюється
    : environment.apiUrl;     // SSR сервер — прямий локальний URL

  get<T>(path: string, params?: Record<string, string | number>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        httpParams = httpParams.set(k, String(v));
      });
    }
    return this.http.get<T>(`${this.base}${path}`, { params: httpParams });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.base}${path}`, body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.base}${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.base}${path}`);
  }
}
