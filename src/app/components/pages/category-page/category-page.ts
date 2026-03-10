import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../../services/news.service';
import { switchMap, tap, catchError, of, combineLatest, distinctUntilChanged, map } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { Pagination } from '../../pagination/pagination';

export type ViewMode = 'standard' | 'text' | 'persons';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [CommonModule, RouterLink, Pagination],
  templateUrl: './category-page.html',
})
export class CategoryPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);
  private injector = inject(Injector);

  public articles = signal<any[]>([]);
  public loading = signal<boolean>(true);
  public displayTitle = signal<string>('');
  public viewMode = signal<ViewMode>('standard');
  public totalItems = signal<number>(0);

  public currentPage = signal<number>(1);
  public pageSize = signal<number>(9);

  private readonly TEXT_ONLY_CATEGORIES = [
    'law-making/bill_under_consideration',
    'law-making/bill_passed_by_legislature',
    'law-making/bill_enacted_into_law',
    'legal_publications/essay-on-it-law',
  ];

  public visiblePages = computed(() => {
    const current = this.currentPage();
    const total = Math.ceil(this.totalItems() / this.pageSize()) || 1;
    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  });

  public hasNextPage = computed(() => {
    return this.currentPage() * this.pageSize() < this.totalItems();
  });

  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      // 1. Стежимо за зміною URL для скидання параметрів та встановлення ViewMode
      this.route.paramMap
        .pipe(
          map((params) => {
            const category = params.get('category');
            const subcategory = params.get('subcategory');
            return subcategory ? `${category}/${subcategory}` : category;
          }),
          distinctUntilChanged(),
        )
        .subscribe((fullSlug) => {
          this.currentPage.set(1);

          // Встановлюємо режим перегляду та дефолтний розмір сторінки для категорії
          if (fullSlug === 'man_law') {
            this.viewMode.set('persons');
            this.pageSize.set(12);
          } else if (this.TEXT_ONLY_CATEGORIES.includes(fullSlug || '')) {
            this.viewMode.set('text');
            this.pageSize.set(10);
          } else {
            this.viewMode.set('standard');
            this.pageSize.set(9);
          }
        });

      // 2. Основний потік завантаження даних
      combineLatest([
        this.route.paramMap,
        toObservable(this.currentPage),
        toObservable(this.pageSize),
      ])
        .pipe(
          tap(() => this.loading.set(true)),
          switchMap(([params, page, size]) => {
            const category = params.get('category');
            const subcategory = params.get('subcategory');
            const fullSlug = subcategory ? `${category}/${subcategory}` : category;

            if (!fullSlug || fullSlug === 'assets') return of(null);

            return this.newsService
              .getArticlesByContentSlug(fullSlug, page, size)
              .pipe(catchError(() => of({ isError: true })));
          }),
        )
        .subscribe((response: any) => {
          if (!response) return;
          if (response.isError) {
            this.articles.set([]);
            this.totalItems.set(0);
          } else {
            this.articles.set(response.articles || []);
            this.totalItems.set(response.total || 0);
            if (response.categoryName) this.displayTitle.set(response.categoryName);
          }
          this.loading.set(false);
        });
    }); // Тепер блок runInInjectionContext закрито правильно
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(size: any) {
    this.pageSize.set(Number(size));
    this.currentPage.set(1);
  }
}
