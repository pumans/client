import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
})
export class Footer {
  public lawmakingLinks = [
    { name: 'Законопроекти на розгляді', link: '/law-making/bill_under_consideration' },
    { name: 'Прийняті закони', link: '/law-making/bill_passed_by_legislature' },
    { name: 'Набули чинності', link: '/law-making/bill_enacted_into_law' },
  ];

  public legalViewLinks = [
    { name: 'Право в мистецтві', link: '/scientific-thought/law_in_art' },
    { name: 'Аналітика', link: '/scientific-thought/practice_public_prosecutor' },
    { name: 'Правова позиція', link: '/scientific-thought/practice_court' },
    { name: 'Наукова думка', link: '/scientific-thought/lawyers-practice' },
  ];

  public practiceLinks = [
    { name: 'Практика правоохоронних органів', link: '/law-practice/pravookhoronnykh-organiv' },
    { name: 'Прокурорська практика', link: '/law-practice/practice_public_prosecutor' },
    { name: 'Судова практика', link: '/law-practice/practice_court' },
    { name: 'Адвокатська практика', link: '/law-practice/lawyers-practice' },
  ];

  public newsLinks = [
    { name: 'Україна', link: '/news/ukraine' },
    { name: 'Міжнародні', link: '/news/international' },
    { name: 'Компаній', link: '/news/companies' },
  ];

  public projectLinks = [
    { name: 'Про нас', link: '/about' },
    { name: 'Редколегія', link: '/editorial-board' },
    { name: 'Контакти', link: '/contacts' },
    { name: 'Для авторів', link: '/for-authors' },
  ];
}
