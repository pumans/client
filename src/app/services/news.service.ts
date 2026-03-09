import { Injectable, inject, TransferState, makeStateKey } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Article } from '../models/article';

const LATEST_NEWS_KEY = makeStateKey<Article[]>('latest-news-key');

export interface CategoryResponse {
  categoryName: string;
  articles: Article[];
}

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);
  private apiUrl = 'http://127.0.0.1:3000/api';
  // Змінна для зберігання новин у пам'яті
  private cachedLatestNews: Article[] | null = null;

  /**
   * Отримує останню новину (ту саму про агресію рф)
   */
  getLatestNews(): Observable<Article[]> {
    // Якщо новини вже є в пам'яті — повертаємо їх як Observable
    if (this.cachedLatestNews) {
      return of(this.cachedLatestNews);
    }

    if (this.transferState.hasKey(LATEST_NEWS_KEY)) {
      const cachedData = this.transferState.get(LATEST_NEWS_KEY, []);
      this.transferState.remove(LATEST_NEWS_KEY); // Очищуємо стан
      this.cachedLatestNews = cachedData; // Зберігаємо в пам'ять для майбутніх переходів!
      return of(cachedData);
    }

    // 3. Сценарій: Серверний рендеринг АБО перше завантаження без SSR
    return this.http.get<Article[]>(`${this.apiUrl}/news/latest`).pipe(
      tap((data) => {
        this.transferState.set(LATEST_NEWS_KEY, data); // Зберігаємо для передачі в браузер
        this.cachedLatestNews = data; // Зберігаємо в пам'ять сервісу
      }),
    );
  }
  // Метод для примусового оновлення (наприклад, кнопка "Оновити")
  refreshNews(): Observable<Article[]> {
    this.cachedLatestNews = null;
    return this.getLatestNews();
  }
  getArticlesByContentSlug(fullSlug: string): Observable<CategoryResponse> {
    // Викликаємо ваш API: http://127.0.0.1:3000/api/content?slug=law-practice/practice_court
    return this.http.get<CategoryResponse>(`${this.apiUrl}/content?slug=${fullSlug}`);
  }
  /**
   * Отримує список новин для конкретного розділу (IBLOCK_SECTION_ID)
   */
  getNewsBySection(sectionId: number, limit: number = 2): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/news/section/${sectionId}?limit=${limit}`);
  }

  getArticleById(id: number): Observable<Article> {
    // Додаємо випадковий параметр, щоб обійти кеш браузера (якщо він є)
    return this.http.get<Article>(`${this.apiUrl}/news/${id}?t=${new Date().getTime()}`);
  }

  // акценти
  getAccentNews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/news/accent`);
  }
}
