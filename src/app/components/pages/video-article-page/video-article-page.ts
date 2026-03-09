import { Component, inject, OnInit, signal, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoService } from '../../../services/video.service';

@Pipe({ name: 'safeVideo', standalone: true })
export class SafeVideoPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string | null): SafeResourceUrl | string {
    if (!url) return '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-video-article-page',
  standalone: true,
  imports: [CommonModule, SafeVideoPipe],
  templateUrl: './video-article-page.html',
})
export class VideoArticlePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private videoService = inject(VideoService);

  public article = signal<any | null>(null);
  public loading = signal<boolean>(true);
  public embedUrl = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        const videoId = Number(idParam);
        if (!isNaN(videoId)) {
          this.fetchVideo(videoId);
        }
      }
    });
  }

  private fetchVideo(id: number) {
    this.loading.set(true);
    this.videoService.getVideoById(id).subscribe({
      next: (data) => {
        this.article.set(data);
        // Передаємо ВСІ можливі поля, де може ховатися відео
        this.formatEmbedUrl(data.videoLink, data.summary, data.detailText);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Помилка завантаження відео:', err);
        this.loading.set(false);
      },
    });
  }

  // Оновлений метод, який об'єднує весь текст і шукає YouTube ID
  private formatEmbedUrl(
    videoLink: string | null,
    summary: string | null,
    detailText: string | null,
  ) {
    // Зливаємо всі поля в один довгий рядок для пошуку
    const textToSearch = [videoLink, summary, detailText].filter(Boolean).join(' ');

    const match = textToSearch.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
    );

    if (match && match[1]) {
      this.embedUrl.set(`https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`);
    } else {
      this.embedUrl.set(null);
    }
  }
}
