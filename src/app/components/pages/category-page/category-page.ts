import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../../services/news.service';
import { Article } from '../../../models/article';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-page.html',
})
export class CategoryPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);
  private cdr = inject(ChangeDetectorRef);

  articles: Article[] = [];
  loading = true;
  displayTitle = '';

  ngOnInit() {
    // Надійна підписка на зміну параметрів шляху
    this.route.paramMap.subscribe((params) => {
      const category = params.get('category');
      const subcategory = params.get('subcategory');

      // Якщо з якоїсь причини категорії немає, нічого не робимо
      if (!category) return;

      // Склеюємо slug так, щоб він точно збігався з ключами в MENU_CONFIG
      const fullSlug = subcategory ? `${category}/${subcategory}` : category;

      // Обов'язково вмикаємо лоадер при кожній зміні меню
      this.loading = true;
      this.fetchArticles(fullSlug);
    });
  }

  private fetchArticles(fullSlug: string) {
    this.loading = true;
    this.cdr.detectChanges();
    this.newsService.getArticlesByContentSlug(fullSlug).subscribe({
      next: (response) => {
        this.displayTitle = response.categoryName;
        this.articles = response.articles;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Помилка завантаження категорії:', err);
        this.displayTitle = 'Розділ не знайдено';
        this.articles = [];
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
