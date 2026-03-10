// main-content.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../../services/news.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './main-content.html',
})
export class MainContent implements OnInit {
  private newsService = inject(NewsService);
  public rows = signal<any[][]>([]);
  public isLoading = signal<boolean>(true);

  ngOnInit() {
    const safeGet = (slug: string) => {
      return this.newsService
        .getArticlesByContentSlug(slug)
        .pipe(catchError(() => of({ articles: [] })));
    };

    forkJoin({
      sudova: safeGet('law-practice/practice_court'),
      advokat: safeGet('law-practice/lawyers-practice'),
      prokuror: safeGet('law-practice/practice_public_prosecutor'),
      pravoohoron: safeGet('law-practice/pravookhoronnykh-organiv'),
    }).subscribe({
      next: (data) => {
        const extract = (res: any, index: number, catTitle: string, catLink: string) => {
          if (res && res.articles && res.articles[index]) {
            return { ...res.articles[index], categoryTitle: catTitle, categoryLink: catLink };
          }
          return null;
        };

        const allRows = [
          // 1 рядок: Судова та Адвокатська
          [
            extract(data.sudova, 0, 'Судова практика', '/law-practice/practice_court'),
            extract(data.advokat, 0, 'Адвокатська практика', '/law-practice/lawyers-practice'),
          ],
          // 2 рядок: Прокурорська та Правоохоронна
          [
            extract(
              data.prokuror,
              0,
              'Прокурорська практика',
              '/law-practice/practice_public_prosecutor',
            ),
            extract(
              data.pravoohoron,
              0,
              'Практика правоохоронних органів',
              '/law-practice/pravookhoronnykh-organiv',
            ),
          ],
        ];

        const validRows = allRows
          .map((row) => row.filter((item) => item !== null))
          .filter((row) => row.length > 0);
        this.rows.set(validRows);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
