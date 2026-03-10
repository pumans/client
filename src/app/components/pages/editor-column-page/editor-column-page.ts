import { ChangeDetectorRef, Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService, ContentItem } from '../../../services/content.service';
import { SimplePagination } from '../../simple-pagination/simple-pagination';

@Component({
  selector: 'app-editor-column-page',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, SimplePagination],
  templateUrl: './editor-column-page.html',
})
export class EditorColumnPage implements OnInit {
  private contentService = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);

  // Використовуємо сигнали для стану
  public isLoading = signal<boolean>(true);
  public error = signal<string | null>(null);
  public items = signal<ContentItem[]>([]);

  private allItems: ContentItem[] = [];
  public currentPage = 1;
  public pageSize = 9;
  public hasNextPage = false;
  public visiblePages: number[] = [];

  private readonly imageBase = 'http://127.0.0.1:3000';

  // --- Гетери для розбиття статей залишаються без змін,
  // але читають дані з сигналу items() ---
  public get featuredArticle(): ContentItem | undefined {
    return this.items().length > 0 ? this.items()[0] : undefined;
  }

  public get row1Articles(): ContentItem[] {
    return this.items().slice(1, 3);
  }

  public get row2Articles(): ContentItem[] {
    return this.items().slice(3, 6);
  }

  public get row3Articles(): ContentItem[] {
    return this.items().slice(6, 9);
  }

  // Замість конструктора з afterNextRender використовуємо звичайний ngOnInit для SSR
  ngOnInit() {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.contentService.getByMenuLink('/editor_column').subscribe({
      next: (response: any) => {
        // Отримуємо масив статей з об'єкта відповіді
        const articlesArray = response?.articles || [];

        const normalized = articlesArray.map((item: any) => ({
          ...item,
          imageUrl: item.imageUrl
            ? `${this.imageBase}${item.imageUrl.startsWith('/') ? '' : '/'}${item.imageUrl}`
            : null,
        }));

        this.allItems = normalized;
        this.currentPage = 1;
        this.applyPagination();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Помилка завантаження колонки редактора:', err);
        this.error.set('Не вдалося завантажити колонку редактора');
        this.isLoading.set(false);
      },
    });
  }

  private applyPagination(): void {
    const total = this.allItems.length;

    if (this.pageSize <= 0) {
      this.items.set(this.allItems);
      this.hasNextPage = false;
      this.updateVisiblePages(total);
      return;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.items.set(this.allItems.slice(startIndex, endIndex));
    this.hasNextPage = endIndex < total;
    this.updateVisiblePages(total);
  }

  goToPage(page: number): void {
    if (page !== this.currentPage && page >= 1) {
      this.currentPage = page;
      this.applyPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  onPageSizeChangeFromPagination(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.applyPagination();
  }
  private updateVisiblePages(totalItems: number): void {
    if (this.pageSize <= 0 || totalItems === 0) {
      this.visiblePages = [];
      return;
    }

    const totalPages = Math.ceil(totalItems / this.pageSize);
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(totalPages, this.currentPage + 2);

    const pages: number[] = [];
    for (let p = start; p <= end; p++) pages.push(p);
    this.visiblePages = pages;
  }
}
