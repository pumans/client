import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
})
export class Navigation {
  // Пункти меню
  public menuItems = [
    {
      name: 'ПРАВОТВОРЧІСТЬ',
      link: '/law-making',
      subItems: [
        { name: 'ЗАКОНОПРОЄКТИ НА РОЗГЛЯДІ', link: '/law-making/bill_under_consideration' },
        { name: 'ПРИЙНЯТІ ЗАКОНИ', link: '/law-making/bill_passed_by_legislature' },
        { name: 'НАБУЛИ ЧИННОСТІ', link: '/law-making/bill_enacted_into_law' },
      ],
    },
    {
      name: 'ПРАВОВА ПРАКТИКА',
      link: '/law-practice',
      subItems: [
        { name: 'ПРАКТИКА ПРАВООХОРОННИХ ОРГАНІВ', link: '/law-practice/pravookhoronnykh-organiv' },
        { name: 'ПРОКУРОРСЬКА ПРАКТИКА', link: '/law-practice/practice_public_prosecutor' },
        { name: 'СУДОВА ПРАКТИКА', link: '/law-practice/practice_court' },
        { name: 'АДВОКАТСЬКА ПРАКТИКА', link: '/law-practice/lawyers-practice' },
      ],
    },
    {
      name: 'ПРАВОВИЙ ПОГЛЯД',
      link: '/scientific-thought',
      subItems: [
        { name: 'ПРАВО В МИСТЕЦТВІ', link: '/scientific-thought/law_in_art' },
        { name: 'АНАЛІТИКА', link: '/scientific-thought/practice_public_prosecutor' },
        { name: 'ПРАВОВА ПОЗИЦІЯ', link: '/scientific-thought/practice_court' },
        { name: 'НАУКОВА ДУМКА', link: '/scientific-thought/lawyers-practice' },
      ],
    },
    {
      name: 'НОВИНИ',
      link: '/news',
      subItems: [
        { name: 'УКРАЇНА', link: '/news/ukraine' },
        { name: 'МІЖНАРОДНІ', link: '/news/international' },
        { name: 'КОМПАНІЙ', link: '/news/companies' },
      ],
    },
    // { name: 'КАЛЕНДАР ПОДІЙ', link: '/events' },
    {
      name: 'МІЖНАРОДНЕ ПРАВО',
      link: '/international_law',
      subItems: [
        { name: 'МІЖНАРОДНЕ ПУБЛІЧНЕ ПРАВО', link: '/international_law/public_international_law' },
        { name: 'МІЖНАРОДНЕ ПРИВАТНЕ ПРАВО', link: '/international_law/private_international_law' },
        { name: 'ПРАВО ЄС', link: '/international_law/european_union_law' },
        { name: 'ПРАКТИКА ЄСПЛ', link: '/international_law/european_court_of_human_rights' },
      ],
    },
    { name: 'UKRAINIAN LAW', link: '/ukrainian_law' },
    {
      name: 'ВИДАННЯ',
      link: '/legal_publications',
      subItems: [
        { name: 'УКРАЇНСЬКІ ВИДАННЯ', link: '/legal_publications/ukrainian_legal_publications' },
        {
          name: 'МІЖНАРОДНІ ВИДАННЯ',
          link: '/legal_publications/international_legal_publications',
        },
        { name: 'ВСЕ З ПРАВА ІТ', link: '/legal_publications/essay-on-it-law' },
      ],
    },
    { name: 'ПРАВО В ОСОБАХ', link: '/man_law' },
    {
      name: 'ВІДЕО',
      link: '/video',
      subItems: [
        { name: 'ДІАЛОГИ ПРО ПРАВО', link: '/video/legal_dialogue' },
        { name: 'ПРАВО В ОСОБАХ', link: '/video/laws_persons' },
        { name: 'ЗАХИСТ БІЗНЕСУ', link: '/video/legal_protection_business' },
        { name: 'ІНТЕРВ`Ю', link: '/video/legal_interview' },
        { name: 'НОВИНИ', link: '/video/legal_video_news' },
        { name: 'ПРАВО ВІЙНИ', link: '/video/pravo-viyny' },
      ],
    },
  ];
  @Input() isMobileMenuOpen = false;
  @Output() closeMenu = new EventEmitter<void>();

  onClose() {
    this.closeMenu.emit();
  }
}
