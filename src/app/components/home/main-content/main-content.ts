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

  // Тепер ми зберігаємо дані у вигляді масиву рядків (в кожному рядку 1 або 2 статті)
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
      prokuror: safeGet('law-practice/practice_public_prosecutor'),
      pravoohoron: safeGet('law-practice/pravookhoronnykh-organiv'),
      advokat: safeGet('law-practice/lawyers-practice'),
      pozyciya: safeGet('scientific-thought/practice_court'),
      analityka: safeGet('scientific-thought/practice_public_prosecutor'),
      naukova: safeGet('scientific-thought/lawyers-practice'),
      mizhnarodne: safeGet('international_law/public_international_law'),
      mystectvo: safeGet('scientific-thought/law_in_art'),
      vydannya: safeGet('legal_publications/ukrainian_legal_publications'),
      osoby: safeGet('man_law'),
      chynni: safeGet('law-making/bill_enacted_into_law'),
      rozglyad: safeGet('law-making/bill_under_consideration'),
      priynyati: safeGet('law-making/bill_passed_by_legislature'),
    }).subscribe({
      next: (data) => {
        // Допоміжна функція, яка дістає статтю і прикріплює до неї її категорію
        const extract = (res: any, index: number, catTitle: string, catLink: string) => {
          if (res && res.articles && res.articles[index]) {
            return {
              ...res.articles[index],
              categoryTitle: catTitle,
              categoryLink: catLink,
            };
          }
          return null; // Якщо статті немає
        };

        const allRows = [
          // 1 строка - 2 новини
          [
            extract(data.sudova, 0, 'Судова практика', '/law-practice/practice_court'),
            extract(data.sudova, 1, 'Судова практика', '/law-practice/practice_court'),
          ],
          // 2 строка
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
          // 3 строка
          [
            extract(data.advokat, 0, 'Адвокатська практика', '/law-practice/lawyers-practice'),
            extract(data.pozyciya, 0, 'Правова позиція', '/scientific-thought/practice_court'),
          ],
          // 4 строка
          [
            extract(
              data.analityka,
              0,
              'Аналітика',
              '/scientific-thought/practice_public_prosecutor',
            ),
            extract(data.naukova, 0, 'Наукова думка', '/scientific-thought/lawyers-practice'),
          ],
          // 5 строка
          [
            extract(
              data.mizhnarodne,
              0,
              'Міжнародне право',
              '/international_law/public_international_law',
            ),
            extract(data.mystectvo, 0, 'Право в мистецтві', '/scientific-thought/law_in_art'),
          ],
          // 6 строка
          [
            extract(
              data.vydannya,
              0,
              'Видання',
              '/legal_publications/ukrainian_legal_publications',
            ),
            extract(data.osoby, 0, 'Право в особах', '/man_law'),
          ],
          // 7 строка - 2 новини
          [
            extract(data.chynni, 0, 'Набули чинності', '/law-making/bill_enacted_into_law'),
            extract(data.chynni, 1, 'Набули чинності', '/law-making/bill_enacted_into_law'),
          ],
          // 8 строка
          [
            extract(
              data.rozglyad,
              0,
              'Законопроєкти на розгляді',
              '/law-making/bill_under_consideration',
            ),
            extract(data.priynyati, 0, 'Прийняті закони', '/law-making/bill_passed_by_legislature'),
          ],
        ];

        // Відфільтровуємо порожні блоки (якщо стаття не знайдена в БД)
        const validRows = allRows
          .map((row) => row.filter((item) => item !== null))
          .filter((row) => row.length > 0);

        this.rows.set(validRows);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Помилка завантаження головного контенту', err);
        this.isLoading.set(false);
      },
    });
  }
}
