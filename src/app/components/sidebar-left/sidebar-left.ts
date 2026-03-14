import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NewsService } from '../../services/news.service';
import { Article } from '../../models/article';

@Component({
  selector: 'app-sidebar-left',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './sidebar-left.html',
})
export class SidebarLeft implements OnInit {
  private newsService = inject(NewsService);

  articles = signal<Article[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.newsService.getLatest().subscribe({
      next: (data: Article[]) => {
        this.articles.set(data);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Помилка завантаження новин:', err);
        this.isLoading.set(false);
      },
    });
  }
}
