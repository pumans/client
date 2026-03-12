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
import { switchMap, tap, catchError, of } from 'rxjs';

import { VideoService } from '../../../services/video.service';
import { SimplePagination } from '../../simple-pagination/simple-pagination';
import { SidebarRight } from '../../sidebar-right/sidebar-right';

@Component({
  selector: 'app-video-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, SimplePagination, SidebarRight ],
  templateUrl: './video-page.html',
})
export class VideoPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private videoService = inject(VideoService);
  private injector = inject(Injector);

  public loading = signal<boolean>(true);
  public displayTitle = signal<string>('Відео');

  // Зберігаємо ВСІ відео, які прийшли з сервера
  public allVideos = signal<any[]>([]);

  // === СИГНАЛИ ДЛЯ ПАГІНАЦІЇ ===
  public currentPage = signal<number>(1);
  public pageSize = signal<number>(10); // 10 відео (ідеально для сітки у 2 колонки)

  // Обчислюваний сигнал: автоматично вирізає потрібний шматок відео для поточної сторінки
  public videos = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    return this.allVideos().slice(startIndex, startIndex + this.pageSize());
  });

  // Перевірка, чи є наступна сторінка
  public hasNextPage = computed(() => {
    return this.currentPage() * this.pageSize() < this.allVideos().length;
  });

  // Обчислення видимих сторінок (як у стандартних новинах)
  public visiblePages = computed(() => {
    const current = this.currentPage();
    const totalItems = this.allVideos().length;
    const total = Math.ceil(totalItems / this.pageSize()) || 1;
    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  });
  // ==============================

  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      // 1. Слухаємо параметри URL (для роботи кнопки "Назад")
      this.route.queryParamMap.subscribe((params) => {
        const page = Number(params.get('page')) || 1;
        this.currentPage.set(page);
      });

      // 2. Слухаємо зміну категорії для завантаження відео
      this.route.paramMap
        .pipe(
          tap(() => {
            this.loading.set(true);
          }),
          switchMap((params) => {
            const subcategory = params.get('subcategory');
            if (!subcategory) return of(null);

            const fullSlug = `video/${subcategory}`;
            return this.videoService.getVideosByCategory(fullSlug).pipe(
              catchError((err) => {
                console.error('Помилка завантаження відео:', err);
                return of({ isError: true });
              }),
            );
          }),
        )
        .subscribe((response: any) => {
          if (!response) {
            this.loading.set(false);
            return;
          }

          if (response.isError) {
            this.displayTitle.set('Розділ не знайдено');
            this.allVideos.set([]);
          } else {
            this.allVideos.set(response.articles || []);

            if (response.categoryName) {
              this.displayTitle.set(response.categoryName);
            }
          }
          this.loading.set(false);
        });
    });
  }

  // === МЕТОДИ ДЛЯ ПАГІНАЦІЇ ===
  goToPage(page: number) {
    // Змінюємо URL замість прямої зміни сигналу
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page === 1 ? null : page },
      queryParamsHandling: 'merge',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // ==============================

  getYoutubeThumbnail(videoLink: string | null): string {
    if (!videoLink) return '/assets/placeholder-video.jpg';

    const match = videoLink.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
    );
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }

    return '/assets/placeholder-video.jpg';
  }
}
