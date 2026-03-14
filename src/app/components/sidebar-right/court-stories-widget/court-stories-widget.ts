import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../services/content.service';
import { Article } from '../../../models/article';

@Component({
  selector: 'app-court-stories-widget',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './court-stories-widget.html',
})
export class CourtStoriesWidget implements OnInit {
  private contentService = inject(ContentService);

  article = signal<Article | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    this.contentService.getBySlug('court_stories', 1, 1).subscribe({
      next: (res) => {
        this.article.set(res.articles[0] ?? null);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Помилка завантаження судових історій:', err);
        this.isLoading.set(false);
      },
    });
  }
}
