import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../../services/news.service';
import { switchMap, tap, catchError, of } from 'rxjs';

export type ViewMode = 'standard' | 'text' | 'persons';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-page.html',
})
export class CategoryPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);

  // 1. Використовуємо Сигнали для 100% гарантії оновлення екрану
  public articles = signal<any[]>([]);
  public loading = signal<boolean>(true);
  public displayTitle = signal<string>('');
  public viewMode = signal<ViewMode>('standard');

  private readonly TEXT_ONLY_CATEGORIES = [
    'law-making/bill_under_consideration',
    'law-making/bill_passed_by_legislature',
    'law-making/bill_enacted_into_law',
    'legal_publications/essay-on-it-law',
  ];

  ngOnInit() {
    this.route.paramMap
      .pipe(
        // tap виконується миттєво при зміні URL
        tap((params) => {
          const category = params.get('category');
          const subcategory = params.get('subcategory');

          if (!category || category === 'assets') return;

          const fullSlug = subcategory ? `${category}/${subcategory}` : category;

          // Визначаємо макет
          if (fullSlug === 'man_law') {
            this.viewMode.set('persons');
          } else if (this.TEXT_ONLY_CATEGORIES.includes(fullSlug)) {
            this.viewMode.set('text');
          } else {
            this.viewMode.set('standard');
          }

          // Миттєво показуємо лоадер і чистимо екран
          this.loading.set(true);
          this.articles.set([]);
        }),
        // switchMap відправляє запит і АВТОМАТИЧНО скасовує його, якщо юзер перейшов в інший розділ
        switchMap((params) => {
          const category = params.get('category');
          const subcategory = params.get('subcategory');

          if (!category || category === 'assets') return of(null);

          const fullSlug = subcategory ? `${category}/${subcategory}` : category;

          return this.newsService.getArticlesByContentSlug(fullSlug).pipe(
            catchError((err) => {
              console.error('Помилка завантаження категорії:', err);
              return of({ isError: true }); // Безпечно перехоплюємо помилки БД
            }),
          );
        }),
      )
      .subscribe((response: any) => {
        // Цей блок гарантовано виконається лише для останнього кліку
        if (!response) return;

        if (response.isError) {
          this.displayTitle.set('Розділ не знайдено');
          this.articles.set([]);
        } else if (Array.isArray(response)) {
          this.articles.set(response);
        } else if (response && response.articles) {
          this.articles.set(response.articles);
          if (response.categoryName) {
            this.displayTitle.set(response.categoryName);
          }
        } else {
          this.articles.set([]);
        }

        this.loading.set(false); // Вимикаємо спінер
      });
  }
}
