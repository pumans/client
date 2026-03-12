import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../../services/news.service';

@Component({
  selector: 'app-judicial-truth-widget',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './judicial-truth-widget.html',
})
export class JudicialTruthWidget implements OnInit {
  private newsService = inject(NewsService);
  public article = signal<any>(null);

  ngOnInit() {
    this.newsService.getArticlesByContentSlug('judicial_truth', 1, 1).subscribe((res: any) => {
      if (res && !res.isError && res.articles?.length > 0) {
        this.article.set(res.articles[0]);
      }
    });
  }
}
