import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { switchMap, tap, catchError, of } from 'rxjs';

import { VideoService, VideoItem, VideoListResponse } from '../../../services/video.service';
import { SimplePagination } from '../../simple-pagination/simple-pagination';
import { SidebarRight } from '../../sidebar-right/sidebar-right';

@Component({
  selector: 'app-video-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, SimplePagination, SidebarRight],
  templateUrl: './video-page.html',
})
export class VideoPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private videoService = inject(VideoService);

  loading = signal(true);
  displayTitle = signal('Відео');
  allVideos = signal<VideoItem[]>([]);
  currentPage = signal(1);
  readonly pageSize = 10;

  videos = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.allVideos().slice(start, start + this.pageSize);
  });

  hasNextPage = computed(() => this.currentPage() * this.pageSize < this.allVideos().length);

  visiblePages = computed(() => {
    const total = Math.ceil(this.allVideos().length / this.pageSize) || 1;
    const current = this.currentPage();
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.currentPage.set(Number(params.get('page')) || 1);
    });

    this.route.paramMap
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap((params) => {
          const subcategory = params.get('subcategory');
          if (!subcategory) return of(null);
          return this.videoService.getBySlug(`video/${subcategory}`).pipe(
            catchError((err: unknown) => {
              console.error('Помилка завантаження відео:', err);
              return of(null);
            }),
          );
        }),
      )
      .subscribe((response: VideoListResponse | null) => {
        if (response) {
          this.allVideos.set(response.articles ?? []);
          this.displayTitle.set(response.categoryName ?? 'Відео');
        } else {
          this.allVideos.set([]);
          this.displayTitle.set('Розділ не знайдено');
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

  getYoutubeThumbnail(videoLink: string | null): string {
    if (!videoLink) return '/assets/placeholder-video.jpg';
    const match = videoLink.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
    );
    return match?.[1]
      ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
      : '/assets/placeholder-video.jpg';
  }
}
