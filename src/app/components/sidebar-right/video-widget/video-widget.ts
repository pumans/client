import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoService, LatestVideos } from '../../../services/video.service';

@Component({
  selector: 'app-video-widget',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './video-widget.html',
})
export class VideoWidget implements OnInit {
  private videoService = inject(VideoService);

  widgetData = signal<LatestVideos | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    this.videoService.getLatest().subscribe({
      next: (data) => {
        this.widgetData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Помилка завантаження віджета відео:', err);
        this.isLoading.set(false);
      },
    });
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
