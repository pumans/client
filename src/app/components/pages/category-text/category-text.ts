import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { switchMap, tap, catchError, of, distinctUntilChanged, map } from 'rxjs';

import { ContentService, ContentItem } from '../../../services/content.service';
import { Article } from '../../../models/article';
import { Pagination } from '../../pagination/pagination';
import { SidebarRight } from '../../sidebar-right/sidebar-right';

@Component({
  selector: 'app-category-text',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, Pagination, SidebarRight],
  templateUrl: './category-text.html',
})
export class CategoryTextComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(ContentService);

  articles = signal<Article[]>([]);
  loading = signal(true);
  displayTitle = signal('');
  totalItems = signal(0);
  currentPage = signal(1);
  readonly pageSize = 10;

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize) || 1);

  visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  hasNextPage = computed(() => this.currentPage() < this.totalPages());

  ngOnInit(): void {
    // Синхронізуємо currentPage з URL
    this.route.queryParamMap.subscribe((params) => {
      this.currentPage.set(Number(params.get('page')) || 1);
    });

    // При зміні slug — скидаємо на першу сторінку
    const slug$ = this.route.url.pipe(
      map((segments) => segments.map((s) => s.path).join('/')),
      distinctUntilChanged(),
    );

    slug$
      .pipe(
        tap((slug) => {
          if (slug) this.currentPage.set(1);
          this.loading.set(true);
        }),
        switchMap((slug) => {
          if (!slug) return of(null);
          const page = this.currentPage();
          return this.contentService.getBySlug(slug, page, this.pageSize).pipe(
            catchError((err: unknown) => {
              console.error('Помилка завантаження категорії:', err);
              return of(null);
            }),
          );
        }),
      )
      .subscribe((res) => {
        if (res) {
          this.articles.set(res.articles as Article[]);
          this.totalItems.set(res.total);
          if (res.categoryName) this.displayTitle.set(res.categoryName);
        } else {
          this.articles.set([]);
          this.totalItems.set(0);
        }
        this.loading.set(false);
      });
  }

  goToPage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page === 1 ? null : page },
      queryParamsHandling: 'merge',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(_size: number): void {
    // pageSize фіксований — метод для сумісності з компонентом Pagination
  }
}
