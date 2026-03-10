import { Component, inject, afterNextRender, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService, ContentItem } from '../../../../services/content.service';
import { Pagination } from '../../../pagination/pagination';

@Component({
  selector: 'app-news-ukraine',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, Pagination],
  templateUrl: './news-ukraine.html',
})
export class NewsUkraine {
  private contentService = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);

  private allItems: ContentItem[] = [];

  public items: ContentItem[] | null = null;
  public isLoading = true;
  public error: string | null = null;

  public currentPage = 1;
  public pageSize = 10;
  public hasNextPage = false;
  public visiblePages: number[] = [];

  // Базовий URL для картинок з бекенду
  private readonly imageBase = 'http://127.0.0.1:3000';

  constructor() {
    // В SSR/hydration інколи потрібно запускати HTTP після першого рендера,
    // і примусово тригерити change detection (як у HeroComponent).
    afterNextRender(() => this.loadData());
  }

  private loadData(): void {
    this.isLoading = true;
    this.error = null;

    this.contentService
      .getByMenuLink('/news/ukraine')
      .subscribe({
        next: (data) => {
          const normalized =
            data?.map((item) => ({
              ...item,
              imageUrl: item.imageUrl
                ? `${this.imageBase}${item.imageUrl.startsWith('/') ? '' : '/'}${item.imageUrl}`
                : null,
            })) ?? [];

          this.allItems = normalized;
          this.currentPage = 1;
          this.applyPagination();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Помилка завантаження новин України:', err);
          this.error = 'Не вдалося завантажити новини України';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  private applyPagination(): void {
    const total = this.allItems.length;

    if (this.pageSize <= 0) {
      this.items = this.allItems;
      this.hasNextPage = false;
      this.updateVisiblePages(total);
      return;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.items = this.allItems.slice(startIndex, endIndex);
    this.hasNextPage = endIndex < total;
    this.updateVisiblePages(total);
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage += 1;
      this.applyPagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.applyPagination();
    }
  }

  goToPage(page: number): void {
    if (page !== this.currentPage && page >= 1) {
      this.currentPage = page;
      this.applyPagination();
    }
  }

  onPageSizeChange(raw: string): void {
    const size = Number(raw);
    this.pageSize = Number.isFinite(size) && size > 0 ? size : 10;
    this.currentPage = 1;
    this.applyPagination();
  }

  onPageSizeChangeFromPagination(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.applyPagination();
  }

  private updateVisiblePages(totalItems: number): void {
    const pages: number[] = [];

    if (this.pageSize <= 0 || totalItems === 0) {
      this.visiblePages = [];
      return;
    }

    const totalPages = Math.ceil(totalItems / this.pageSize);

    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(totalPages, this.currentPage + 2);

    for (let p = start; p <= end; p++) {
      pages.push(p);
    }

    this.visiblePages = pages;
  }
}

