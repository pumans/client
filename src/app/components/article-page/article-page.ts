import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { Article } from '../../models/article';
import { SidebarRight } from '../sidebar-right/sidebar-right';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-page',
  imports: [RouterLink, SidebarRight, DatePipe, CommonModule],
  templateUrl: './article-page.html',
})
export class ArticlePage implements OnInit {
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);

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
    // Відслідковуємо зміну ID в URL (наприклад, при переході між схожими статтями)
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadArticle(id);
      }
    });
  }

  private loadArticle(id: number) {
    this.isLoading = true;
    this.newsService.getArticleById(id).subscribe({
      next: (data) => {
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
