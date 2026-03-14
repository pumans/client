import { Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Article, ArticleListResponse } from '../models/article';

export interface ContentItem extends Article {
  time?: string;
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

/**
 * Сервіс контенту.
 * Відповідальність: запити до /api/content/*
 * Кешує списки статей за slug щоб уникнути повторних запитів при навігації "назад".
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private api = inject(ApiService);
  private cache = new Map<string, ArticleListResponse>();

  /**
   * Список статей для будь-якого пункту меню.
   * @param slug — наприклад 'news/ukraine', 'law-making', 'pravotvorchist'
   */
  getBySlug(slug: string, page = 1, limit = 20): Observable<ArticleListResponse> {
    const cleanSlug = slug.replace(/^\/+/, '');
    const cacheKey = `${cleanSlug}:${page}:${limit}`;

    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey)!);
    }

    return this.api.get<ArticleListResponse>('/content', { slug: cleanSlug, page, limit }).pipe(
      tap(data => this.cache.set(cacheKey, data)),
    );
  }

  /**
   * Остання одна стаття для віджетів на сайдбарі.
   * @param slug — наприклад 'editor_column'
   */
  getLatestBySlug(slug: string): Observable<LatestContentItem | null> {
    const cleanSlug = slug.replace(/^\/+/, '');
    return this.api.get<LatestContentItem | null>('/content/latest', { slug: cleanSlug });
  }

  /** Скинути кеш для конкретного slug або весь */
  clearCache(slug?: string): void {
    if (slug) {
      const cleanSlug = slug.replace(/^\/+/, '');
      // Видаляємо всі записи для цього slug (всі сторінки)
      for (const key of this.cache.keys()) {
        if (key.startsWith(cleanSlug)) this.cache.delete(key);
      }
    } else {
      this.cache.clear();
    }
  }
}
