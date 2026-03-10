import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../services/video.service';
import { switchMap, tap, catchError, of } from 'rxjs';

// УВАГА: Перевірте правильність шляху до вашого компонента Pagination!
import { Pagination } from '../../../components/pagination/pagination';

@Component({
  selector: 'app-video-page',
  standalone: true,
  imports: [CommonModule, RouterLink, Pagination], // Додано Pagination в імпорти
  templateUrl: './video-page.html',
})
export class VideoPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private videoService = inject(VideoService);

  public loading = signal<boolean>(true);
  public displayTitle = signal<string>('Відео');

  // Зберігаємо ВСІ відео, які прийшли з сервера
  public allVideos = signal<any[]>([]);

  // === СИГНАЛИ ДЛЯ ПАГІНАЦІЇ ===
  public currentPage = signal<number>(1);
  public pageSize = signal<number>(6); // За замовчуванням показуємо 6 відео на сторінці

  // Обчислюваний сигнал: автоматично вирізає потрібний шматок відео для поточної сторінки
  public videos = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    return this.allVideos().slice(startIndex, startIndex + this.pageSize());
  });

  // Перевірка, чи є наступна сторінка
  public hasNextPage = computed(() => {
    return this.currentPage() * this.pageSize() < this.allVideos().length;
  });

  // Генеруємо масив номерів сторінок (1, 2, 3...)
  public visiblePages = computed(() => {
    const totalPages = Math.ceil(this.allVideos().length / this.pageSize()) || 1;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  });
  // ==============================

  ngOnInit() {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.allVideos.set([]); // Очищаємо перед новим завантаженням
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
        if (!response) return;

        if (response.isError) {
          this.displayTitle.set('Розділ не знайдено');
        } else {
          this.allVideos.set(response.articles || []);
          this.currentPage.set(1); // Завжди повертаємось на 1 сторінку при зміні категорії

          if (response.categoryName) {
            this.displayTitle.set(response.categoryName);
          }
        }
        this.loading.set(false);
      });
  }

  // === МЕТОДИ ДЛЯ ПАГІНАЦІЇ ===
  goToPage(page: number) {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Плавна прокрутка вгору при зміні сторінки
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1); // Повертаємось на 1 сторінку при зміні ліміту
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
