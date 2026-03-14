import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../../services/news.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  imports: [RouterLink],
})
export class HeroComponent implements OnInit {
  private newsService = inject(NewsService);

  // Використовуємо сигнал замість звичайного масиву
  public featuredArticles = signal<any[]>([]);

  ngOnInit() {
    this.newsService.getAccent().subscribe({
      next: (data) => {
        this.featuredArticles.set(data);
      },
      error: (err) => console.error('Помилка завантаження акцентів:', err),
    });
  }
}
