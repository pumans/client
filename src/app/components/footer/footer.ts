import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
})
export class Footer {
  public lawmakingLinks = ['Законопроекти на розгляді', 'Прийняті закони', 'Набули чинності'];
  public legalViewLinks = ['Право в мистецтві', 'Аналітика', 'Правова позиція', 'Наукова думка'];

  public practiceLinks = [
    'Практика правоохоронних органів',
    'Прокурорська практика',
    'Судова практика',
    'Адвокатська практика',
  ];
  public newsLinks = ['Україна', 'Міжнародні', 'Компаній'];

  public projectLinks = ['Про нас', 'Редколегія', 'Контакти', 'Для авторів'];
}
