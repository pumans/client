import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../services/video.service';
import { switchMap, tap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-video-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './video-page.html',
})
export class VideoPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private videoService = inject(VideoService);

  public videos = signal<any[]>([]);
  public loading = signal<boolean>(true);
  public displayTitle = signal<string>('Відео');

  ngOnInit() {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.videos.set([]);
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
          this.videos.set(response.articles || []);
          if (response.categoryName) {
            this.displayTitle.set(response.categoryName);
          }
        }
        this.loading.set(false);
      });
  }

  // Тепер ми дістаємо ID відео НАПРЯМУ з нового поля videoLink!
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
