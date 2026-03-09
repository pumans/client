import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsService } from '../../../services/news.service';
import { Article } from '../../../models/article';
import { SidebarRight } from '../../sidebar-right/sidebar-right';
import { DatePipe, CommonModule } from '@angular/common';
import { of, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-article-page',
  imports: [RouterLink, SidebarRight, DatePipe, CommonModule],
  templateUrl: './article-page.html',
  standalone: true,
})
export class ArticlePage implements OnInit {
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);
  private cdr = inject(ChangeDetectorRef);
  private routeSub: Subscription | null = null;

  public article: Article | null = null;
  public isLoading = true;

  public tags = [
    'Володимир Зеленський',
    'РНБО',
    'національна безпека',
    'Захист',
    'критична інфраструктура',
    'Енергетика',
  ];

  public relatedArticles = [
    {
      id: 1,
      title: "Верховний Суд роз'яснив порядок розгляду справ про незаконне звільнення",
      date: '2 березня 2026, 14:30',
      image:
        'https://images.unsplash.com/photo-1685747750264-a4e932005dde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VydGhvdXNlJTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcyMDEyNDEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      title: 'Нова практика господарських судів у справах про банкрутство',
      date: '1 березня 2026, 10:15',
      image:
        'https://images.unsplash.com/photo-1598139384902-5a8217874645?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 3,
      title: 'Оскарження бездіяльності прокурора: процедура та строки',
      date: '28 лютого 2026, 16:00',
      image:
        'https://images.unsplash.com/photo-1711365306958-577e114787ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
  ];

  ngOnInit() {
    this.routeSub = this.route.paramMap
      .pipe(
        switchMap((params) => {
          const rawId = params.get('id');
          const id = Number(rawId);
          console.log('Перехід на новину ID:', id); // Для діагностики

          // Якщо id не число (наприклад, маршрут /news/ukraine),
          // не робимо HTTP-запит, щоб не викликати помилок та PendingTasks.
          if (!rawId || Number.isNaN(id)) {
            console.warn('Некоректний ID новини в маршруті:', rawId);
            this.isLoading = false;
            this.article = null;
            this.cdr.detectChanges();
            // Повертаємо observable, який емiтить null і одразу завершується.
            return of(null as any);
          }

          this.isLoading = true;
          this.article = null;
          this.cdr.detectChanges(); // Повідомляємо про початок завантаження

          return this.newsService.getArticleById(id);
        }),
      )
      .subscribe({
        next: (data) => {
          this.article = data;
          this.isLoading = false;
          this.cdr.detectChanges(); // ПРИМУСОВО оновлюємо інтерфейс
        },
        error: (err) => {
          console.error('Помилка завантаження:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }
  ngOnDestroy() {
    // Важливо відписатися, щоб не було витоків пам'яті
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  private loadArticle(id: number) {
    this.isLoading = true;
    this.newsService.getArticleById(id).subscribe({
      next: (data) => {
        console.log('Отримані дані статті:', data);
        this.article = data;
        this.isLoading = false;
        // Можна також завантажити схожі статті з тієї ж секції
      },
      error: (err) => {
        console.error('Помилка завантаження статті:', err);
        this.isLoading = false;
      },
    });
  }
}
