import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Article } from '../models/article';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api'; // Адреса вашого Node.js сервера

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

    // Якщо новин немає — робимо запит і зберігаємо результат через tap
    return this.http
      .get<Article[]>(`${this.apiUrl}/news/latest`)
      .pipe(tap((data) => (this.cachedLatestNews = data)));
  }
  // Метод для примусового оновлення (наприклад, кнопка "Оновити")
  refreshNews(): Observable<Article[]> {
    this.cachedLatestNews = null;
    return this.getLatestNews();
  }

  /**
   * Отримує список новин для конкретного розділу (IBLOCK_SECTION_ID)
   */
  getNewsBySection(sectionId: number, limit: number = 2): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/news?sectionId=${sectionId}&limit=${limit}`);
  }

  getArticleById(id: number): Observable<Article> {
    // Додаємо випадковий параметр, щоб обійти кеш браузера (якщо він є)
    return this.http.get<Article>(`${this.apiUrl}/news/${id}?t=${new Date().getTime()}`);
  }
}
