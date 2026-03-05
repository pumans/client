import { Component, OnInit, inject } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Article } from '../../models/article';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sidebar-left',
  imports: [RouterLink, DatePipe],
  templateUrl: './sidebar-left.html',
})
export class SidebarLeft implements OnInit {
  private newsService = inject(NewsService);
  public sections: any[] = [];

  ngOnInit() {
    this.newsService.getLatestNews().subscribe({
      next: (data: Article[]) => {
        this.sections = [
          {
            title: 'ОСТАННІ НОВИНИ',
            articles: data, // 'data' вже є масивом з 10 новин
          },
        ];
      },
      error: (err) => console.error('Помилка завантаження новин:', err),
    });
  }
}
