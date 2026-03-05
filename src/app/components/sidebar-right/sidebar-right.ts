import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-right',
  imports: [],
  templateUrl: './sidebar-right.html',
  standalone: true,
})
export class SidebarRight {
  public popularToday = [
    { title: 'Як правильно скласти позовну заяву до суду', views: '12.5K' },
    { title: 'Трудові права при звільненні: повний гід', views: '9.8K' },
    { title: 'Податкова декларація 2026: покрокова інструкція', views: '8.2K' },
    { title: 'Спадкування нерухомості: що важливо знати', views: '7.1K' },
  ];

  // Створюємо масив з числами від 1 до 31 для календаря
  public days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Активний день у календарі
  public activeDay = 26;
}
