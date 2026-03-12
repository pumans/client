import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import {
  debounceTime,
  switchMap,
  tap,
  catchError,
  of,
  combineLatest,
  distinctUntilChanged,
  map,
} from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

import { NewsService } from '../../../services/news.service';
import { SimplePagination } from '../../simple-pagination/simple-pagination';
import { SidebarRight } from '../../sidebar-right/sidebar-right';

@Component({
  selector: 'app-category-standard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, SimplePagination, SidebarRight],
  templateUrl: './category-standard.html',
})
export class CategoryStandardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private newsService = inject(NewsService);
  private injector = inject(Injector);

  public articles = signal<any[]>([]);
  public loading = signal<boolean>(true);
  public displayTitle = signal<string>('');
  public totalItems = signal<number>(0);

  public currentPage = signal<number>(1);
  public pageSize = signal<number>(9);
  public currentCategorySlug = signal<string>('');

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
      // 1. Отримуємо повний шлях (slug) безпосередньо з сегментів URL
      const slug$ = this.route.url.pipe(
        map((segments) => segments.map((s) => s.path).join('/')),
        distinctUntilChanged(),
      );

      this.route.queryParamMap.subscribe((params) => {
        const page = Number(params.get('page')) || 1;
        this.currentPage.set(page);
      });

      slug$.subscribe((fullSlug) => {
        this.currentCategorySlug.set(fullSlug || '');

        if (fullSlug === 'man_law') {
          this.pageSize.set(12);
        } else {
          this.pageSize.set(9);
        }
      });

      // 2. Основний потік завантаження даних
      combineLatest([slug$, toObservable(this.currentPage), toObservable(this.pageSize)])
        .pipe(
          // НОВЕ: debounceTime запобігає подвійному запиту,
          // якщо одночасно змінюється і категорія, і параметр page
          debounceTime(50),
          tap(() => this.loading.set(true)),
          switchMap(([fullSlug, page, size]) => {
            if (!fullSlug || fullSlug === 'assets') return of(null);

            return this.newsService
              .getArticlesByContentSlug(fullSlug, page, size)
              .pipe(catchError(() => of({ isError: true })));
          }),
        )
        .subscribe((response: any) => {
          if (!response) {
            this.loading.set(false);
            return;
          }
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
    });
  }

  goToPage(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page === 1 ? null : page }, // Якщо 1 сторінка - прибираємо ?page= з URL для краси
      queryParamsHandling: 'merge', // Зберігаємо інші параметри, якщо вони є
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
