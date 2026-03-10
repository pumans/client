import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../../services/news.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-bottom-content',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bottom-content.html',
})
export class BottomContentComponent implements OnInit {
  private newsService = inject(NewsService);

  // Три окремі масиви для газетного макета
  public leftColumn = signal<any[]>([]);
  public rightTop = signal<any[]>([]);
  public rightBottom = signal<any[]>([]);
  public isLoading = signal<boolean>(true);

  ngOnInit() {
    const safeGet = (slug: string) =>
      this.newsService.getArticlesByContentSlug(slug).pipe(catchError(() => of({ articles: [] })));

    forkJoin({
      rozglyad: safeGet('law-making/bill_under_consideration'),
      priynyati: safeGet('law-making/bill_passed_by_legislature'),
      chynni: safeGet('law-making/bill_enacted_into_law'),
      pozyciya: safeGet('scientific-thought/practice_court'),
      analityka: safeGet('scientific-thought/practice_public_prosecutor'),
      naukova: safeGet('scientific-thought/lawyers-practice'),
      vydannya: safeGet('legal_publications/ukrainian_legal_publications'),
    }).subscribe({
      next: (data) => {
        const extract = (res: any, catTitle: string, catLink: string) => {
          if (res && res.articles && res.articles[0]) {
            return { ...res.articles[0], categoryTitle: catTitle, categoryLink: catLink };
          }
          return null;
        };

        // Лівий стовпчик: Законопроєкти, Прийняті, Набули чинності
        this.leftColumn.set(
          [
            extract(
              data.rozglyad,
              'Законопроєкти на розгляді',
              '/law-making/bill_under_consideration',
            ),
            extract(data.priynyati, 'Прийняті закони', '/law-making/bill_passed_by_legislature'),
            extract(data.chynni, 'Набули чинності', '/law-making/bill_enacted_into_law'),
          ].filter((item) => item !== null),
        );

        // Правий верхній рядок: Правова позиція, Аналітика
        this.rightTop.set(
          [
            extract(data.pozyciya, 'Правова позиція', '/scientific-thought/practice_court'),
            extract(data.analityka, 'Аналітика', '/scientific-thought/practice_public_prosecutor'),
          ].filter((item) => item !== null),
        );

        // Правий нижній рядок: Наукова думка, Видання
        this.rightBottom.set(
          [
            extract(data.naukova, 'Наукова думка', '/scientific-thought/lawyers-practice'),
            extract(data.vydannya, 'Видання', '/legal_publications/ukrainian_legal_publications'),
          ].filter((item) => item !== null),
        );

        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
