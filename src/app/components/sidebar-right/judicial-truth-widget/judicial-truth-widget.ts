import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../services/content.service';
import { Article } from '../../../models/article';

@Component({
  selector: 'app-judicial-truth-widget',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './judicial-truth-widget.html',
})
export class JudicialTruthWidget implements OnInit {
  private contentService = inject(ContentService);

  article = signal<Article | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    this.contentService.getBySlug('judicial_truth', 1, 1).subscribe({
      next: (res) => {
        this.article.set(res.articles[0] ?? null);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Помилка завантаження Судової правди:', err);
        this.isLoading.set(false);
      },
    });
  }
}
