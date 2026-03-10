import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../../services/news.service';

@Component({
  selector: 'app-man-law',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './man-law.html',
})
export class ManLawComponent implements OnInit {
  private newsService = inject(NewsService);
  public articles = signal<any[]>([]);
  public isLoading = signal<boolean>(true);

  ngOnInit() {
    // Завантажуємо 4 останні статті для 4 колонок
    this.newsService.getArticlesByContentSlug('man_law', 1, 4).subscribe({
      next: (res: any) => {
        this.articles.set(res.articles || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
