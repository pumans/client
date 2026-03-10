import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

export interface ContentItem {
  id: number;
  title: string;
  date: string;
  summary: string | null;
  imageUrl: string | null;
  /** Час у форматі HH:mm (опційно, інакше виводиться з date) */
  time?: string;
  /** Категорія (наприклад, "УКРАЇНА") */
  category?: string;
  isLive?: boolean;
  isSpecial?: boolean;
  isUpdated?: boolean;
}

export interface LatestContentItem {
  id: number;
  title: string;
  date: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private http = inject(HttpClient);

  // Якщо потрібне інше API‑коріння (наприклад, через proxy), змініть цю змінну.
  private readonly apiBase = 'http://127.0.0.1:3000/api';

  // Простий кеш за slug, щоб при поверненні "назад" дані не зникали
  private cache = new Map<string, ContentItem[]>();

  /**
   * Завантажити список матеріалів для будь‑якого пункту меню.
   * На вхід подається повний Angular‑`link`, наприклад: '/news/ukraine'.
   */
  getByMenuLink(link: string): Observable<ContentItem[]> {
    const slug = (link || '').replace(/^\/+/, '');

    if (this.cache.has(slug)) {
      return of(this.cache.get(slug)!);
    }

    return this.http
      .get<ContentItem[]>(`${this.apiBase}/content`, { params: { slug } })
      .pipe(tap((data) => this.cache.set(slug, data)));
  }

  /**
   * За потреби можна примусово оновити дані для певного пункту меню.
   */
  refreshByMenuLink(link: string): Observable<ContentItem[]> {
    const slug = (link || '').replace(/^\/+/, '');
    this.cache.delete(slug);
    return this.getByMenuLink(link);
  }

  getLatestByMenuLink(link: string): Observable<LatestContentItem | null> {
    const slug = (link || '').replace(/^\/+/, '');
    return this.http.get<LatestContentItem | null>(`${this.apiBase}/content/latest`, {
      params: { slug },
    });
  }
}

