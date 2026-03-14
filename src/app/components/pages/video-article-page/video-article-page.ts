import { Component, inject, OnInit, signal, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoService, VideoItem } from '../../../services/video.service';

@Pipe({ name: 'safeVideo', standalone: true })
export class SafeVideoPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  transform(url: string | null): SafeResourceUrl | string {
    if (!url) return '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-video-article-page',
  standalone: true,
  imports: [CommonModule, DatePipe, SafeVideoPipe],
  templateUrl: './video-article-page.html',
})
export class VideoArticlePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private videoService = inject(VideoService);

  article = signal<VideoItem | null>(null);
  loading = signal(true);
  embedUrl = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!isNaN(id) && id > 0) this.fetchVideo(id);
    });
  }

  private fetchVideo(id: number): void {
    this.loading.set(true);
    this.videoService.getById(id).subscribe({
      next: (data) => {
        this.article.set(data);
        this.embedUrl.set(this.extractEmbedUrl(data.videoLink, data.summary));
        this.loading.set(false);
      },
      error: (err: unknown) => {
        console.error('Помилка завантаження відео:', err);
        this.loading.set(false);
      },
    });
  }

  private extractEmbedUrl(...sources: (string | null | undefined)[]): string | null {
    const text = sources.filter(Boolean).join(' ');
    const match = text.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
    );
    return match?.[1] ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : null;
  }
}
