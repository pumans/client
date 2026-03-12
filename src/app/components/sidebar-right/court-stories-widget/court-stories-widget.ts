import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../../services/news.service';

@Component({
  selector: 'app-court-stories-widget',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './court-stories-widget.html',
})
export class CourtStoriesWidget implements OnInit {
  private newsService = inject(NewsService);
  public article = signal<any>(null);

  ngOnInit() {
    this.newsService.getArticlesByContentSlug('court_stories', 1, 1).subscribe((res: any) => {
      if (res && !res.isError && res.articles?.length > 0) {
        this.article.set(res.articles[0]);
      }
    });
  }
}
