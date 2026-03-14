import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ContentService, ContentItem } from '../../../../services/content.service';
import { ArticleListResponse } from '../../../../models/article';
import { Pagination } from '../../../pagination/pagination';

@Component({
  selector: 'app-news-ukraine',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, Pagination],
  templateUrl: './news-ukraine.html',
})
export class NewsUkraine implements OnInit {
  private contentService = inject(ContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly slug = 'news/ukraine';
  readonly pageSize = 20;

  isLoading = signal(true);
  error = signal<string | null>(null);
  items = signal<ContentItem[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);

  hasNextPage = computed(() => this.currentPage() < this.totalPages());

  visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const page = Number(params.get('page')) || 1;
      this.currentPage.set(page);
      this.loadPage(page);
    });
  }

  private loadPage(page: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.contentService.getBySlug(this.slug, page, this.pageSize).subscribe({
      next: (res: ArticleListResponse) => {
        this.items.set(res.articles as ContentItem[]);
        this.totalPages.set(res.totalPages);
        this.totalItems.set(res.total);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Помилка завантаження новин України:', err);
        this.error.set('Не вдалося завантажити новини');
        this.isLoading.set(false);
      },
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

  onPageSizeChangeFromPagination(_size: number): void {
    // pageSize фіксований — метод лишається для сумісності з компонентом Pagination
  }
}
