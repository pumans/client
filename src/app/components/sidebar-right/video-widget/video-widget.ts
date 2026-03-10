import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoService } from '../../../services/video.service';

@Component({
  selector: 'app-video-widget',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './video-widget.html',
})
export class VideoWidget implements OnInit {
  private videoService = inject(VideoService);

  // Сигнал тепер зберігає об'єкт із двома відео
  public widgetData = signal<{ dialogueVideo: any; otherVideo: any } | null>(null);

  ngOnInit() {
    this.videoService.getLatestVideo().subscribe({
      next: (data) => {
        this.widgetData.set(data);
      },
      error: (err) => {
        console.error('Помилка завантаження віджета відео:', err);
      },
    });
  }

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
