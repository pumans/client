import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ArticlePage } from './components/pages/article-page/article-page';
import { EditorColumnPage } from './components/pages/editor-column-page/editor-column-page';
import { CategoryPageComponent } from './components/pages/category-page/category-page'; // Ваш новий універсальний компонент
import { VideoPageComponent } from './components/pages/video-page/video-page';
import { VideoArticlePageComponent } from './components/pages/video-article-page/video-article-page';
import { CategoryStandardComponent } from './components/pages/category-standard/category-standard';
import { CategoryTextComponent } from './components/pages/category-text/category-text';
import { About } from './components/footer/about/about';
import { EditorialBoard } from './components/footer/editorial-board/editorial-board';
import { Contacts } from './components/footer/contacts/contacts';
import { ForAuthors } from './components/footer/for-authors/for-authors';

export const routes: Routes = [
  // 1. Точні статичні маршрути (перевіряються першими)
  { path: '', component: Home },
  { path: 'editor_column', component: EditorColumnPage },

  // 2. Сторінка конкретної статті
  { path: 'article/:id', component: ArticlePage },

  // --- НОВІ МАРШРУТИ ДЛЯ ВІДЕО ---
  { path: 'video-article/:id', component: VideoArticlePageComponent },
  // Ловимо запити на кшталт video/legal_dialogue
  { path: 'video/:subcategory', component: VideoPageComponent },
  {
    path: 'law-making/bill_under_consideration',
    component: CategoryTextComponent,
  },
  {
    path: 'law-making/bill_passed_by_legislature',
    component: CategoryTextComponent,
  },
  {
    path: 'law-making/bill_enacted_into_law',
    component: CategoryTextComponent,
  },
  {
    path: 'legal_publications/essay-on-it-law',
    component: CategoryTextComponent,
  },
  { path: 'about', component: About },
  { path: 'editorial-board', component: EditorialBoard },
  { path: 'contacts', component: Contacts },
  { path: 'for-authors', component: ForAuthors },
  // 3. Універсальні динамічні маршрути для ВСІХ категорій меню
  // Обробляє шляхи типу: /news/ukraine, /law-making/bill_under_consideration
  { path: ':category/:subcategory', component: CategoryStandardComponent },

  // Обробляє шляхи типу: /news, /man_law, /ukrainian_law
  { path: ':category', component: CategoryStandardComponent },

  // 4. Перенаправлення для неіснуючих сторінок (має бути в самому кінці)
  { path: '**', redirectTo: '' },
];
