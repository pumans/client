import { Component } from '@angular/core';

@Component({
  selector: 'app-popular-today-widget',
  standalone: true,
  templateUrl: './popular-today-widget.html',
})
export class PopularTodayWidget {
  public popularToday = [
    { title: 'Як правильно скласти позовну заяву до суду', views: '12.5K' },
    { title: 'Трудові права при звільненні: повний гід', views: '9.8K' },
    { title: 'Податкова декларація 2026: покрокова інструкція', views: '8.2K' },
    { title: 'Спадкування нерухомості: що важливо знати', views: '7.1K' },
  ];
}

