import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ContentService, ContentItem } from '../../../services/content.service';
import { SimplePagination } from '../../simple-pagination/simple-pagination';
import { SidebarRight } from '../../sidebar-right/sidebar-right';

@Component({
  selector: 'app-editor-column-page',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, SimplePagination, SidebarRight],
  templateUrl: './editor-column-page.html',
})
export class EditorColumnPage implements OnInit {
  private contentService = inject(ContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly slug = 'editor_column';
  readonly pageSize = 9;

  isLoading = signal(true);
  error = signal<string | null>(null);
  items = signal<ContentItem[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);

  hasNextPage = computed(() => this.currentPage() < this.totalPages());

  visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  // Геттери для розбиття статей по сітці — читають з сигналу
  get featuredArticle(): ContentItem | undefined {
    return this.items()[0];
  }
  get row1Articles(): ContentItem[] {
    return this.items().slice(1, 3);
  }
  get row2Articles(): ContentItem[] {
    return this.items().slice(3, 6);
  }
  get row3Articles(): ContentItem[] {
    return this.items().slice(6, 9);
  }

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
      next: (res) => {
        this.items.set(res.articles as ContentItem[]);
        this.totalPages.set(res.totalPages);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Помилка завантаження колонки редактора:', err);
        this.error.set('Не вдалося завантажити колонку редактора');
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
}
