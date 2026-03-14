import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../services/content.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Конфіг рубрик для цього блоку — легко розширювати без правки логіки
const SECTIONS = [
  { key: 'rozglyad',  slug: 'law-making/bill_under_consideration',           title: 'Законопроєкти на розгляді',  link: '/law-making/bill_under_consideration' },
  { key: 'priynyati', slug: 'law-making/bill_passed_by_legislature',          title: 'Прийняті закони',            link: '/law-making/bill_passed_by_legislature' },
  { key: 'chynni',    slug: 'law-making/bill_enacted_into_law',               title: 'Набули чинності',            link: '/law-making/bill_enacted_into_law' },
  { key: 'pozyciya',  slug: 'scientific-thought/pravova-pozytsiya',           title: 'Правова позиція',            link: '/scientific-thought/pravova-pozytsiya' },
  { key: 'analityka', slug: 'scientific-thought/legal_analyst',               title: 'Аналітика',                  link: '/scientific-thought/legal_analyst' },
  { key: 'naukova',   slug: 'scientific-thought/naukova-dumka',               title: 'Наукова думка',              link: '/scientific-thought/naukova-dumka' },
  { key: 'vydannya',  slug: 'legal_publications/ukrainian_legal_publications', title: 'Видання',                   link: '/legal_publications/ukrainian_legal_publications' },
] as const;

type SectionKey = typeof SECTIONS[number]['key'];

interface BottomArticle {
  id: number;
  title: string;
  imageUrl: string | null;
  date: string;
  categoryTitle: string;
  categoryLink: string;
}

@Component({
  selector: 'app-bottom-content',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bottom-content.html',
})
export class BottomContentComponent implements OnInit {
  private contentService = inject(ContentService);

  leftColumn  = signal<BottomArticle[]>([]);
  rightTop    = signal<BottomArticle[]>([]);
  rightBottom = signal<BottomArticle[]>([]);
  isLoading   = signal(true);

  ngOnInit(): void {
    const requests = Object.fromEntries(
      SECTIONS.map(s => [
        s.key,
        this.contentService.getBySlug(s.slug, 1, 1).pipe(
          map(res => res.articles[0] ?? null),
          catchError(() => of(null)),
        ),
      ]),
    ) as Record<SectionKey, ReturnType<typeof of>>;

    forkJoin(requests).subscribe({
      next: (data: Record<SectionKey, any>) => {
        const toItem = (key: SectionKey): BottomArticle | null => {
          const section = SECTIONS.find(s => s.key === key)!;
          const article = data[key];
          if (!article) return null;
          return { ...article, categoryTitle: section.title, categoryLink: section.link };
        };

        this.leftColumn.set(
          (['rozglyad', 'priynyati', 'chynni'] as SectionKey[]).map(toItem).filter(Boolean) as BottomArticle[],
        );
        this.rightTop.set(
          (['pozyciya', 'analityka'] as SectionKey[]).map(toItem).filter(Boolean) as BottomArticle[],
        );
        this.rightBottom.set(
          (['naukova', 'vydannya'] as SectionKey[]).map(toItem).filter(Boolean) as BottomArticle[],
        );

        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
