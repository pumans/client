import { Injectable, inject } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Article, ArticleListResponse } from '../models/article';

const LATEST_NEWS_KEY = makeStateKey<Article[]>('latest-news');

/**
 * Сервіс новин.
 * Відповідальність: запити до /api/news/*
 * Кешує список останніх новин між навігаціями (TransferState для SSR).
 */
@Injectable({ providedIn: 'root' })
export class NewsService {
  private api = inject(ApiService);
  private transferState = inject(TransferState);
  private cachedLatest: Article[] | null = null;

  /** Останні новини для головної сторінки */
  getLatest(): Observable<Article[]> {
    if (this.cachedLatest) {
      return of(this.cachedLatest);
    }
    if (this.transferState.hasKey(LATEST_NEWS_KEY)) {
      const data = this.transferState.get(LATEST_NEWS_KEY, []);
      this.transferState.remove(LATEST_NEWS_KEY);
      this.cachedLatest = data;
      return of(data);
    }
    return this.api.get<Article[]>('/news/latest').pipe(
      tap((data) => {
        this.transferState.set(LATEST_NEWS_KEY, data);
        this.cachedLatest = data;
      }),
    );
  }

  /** Акцентні новини (для hero-блоку) */
  getAccent(): Observable<Article[]> {
    return this.api.get<Article[]>('/news/accent');
  }

  /** Одна стаття за ID */
  getById(id: number): Observable<Article> {
    return this.api.get<Article>(`/news/${id}`);
  }

  /** Статті за slug категорії з пагінацією */
  getArticlesByContentSlug(
    slug: string,
    page: number = 1,
    pageSize: number = 9,
  ): Observable<ArticleListResponse> {
    return this.api.get<ArticleListResponse>(
      `/content?slug=${slug}&page=${page}&limit=${pageSize}`,
    );
  }

  /** Скинути кеш останніх новин */
  clearCache(): void {
    this.cachedLatest = null;
  }
}
