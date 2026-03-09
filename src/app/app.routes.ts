import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ArticlePage } from './components/pages/article-page/article-page';
import { EditorColumnPage } from './components/pages/editor-column-page/editor-column-page';
import { CategoryPageComponent } from './components/pages/category-page/category-page'; // Ваш новий універсальний компонент
import { VideoPageComponent } from './components/pages/video-page/video-page';
import { VideoArticlePageComponent } from './components/pages/video-article-page/video-article-page';

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

  // 3. Універсальні динамічні маршрути для ВСІХ категорій меню
  // Обробляє шляхи типу: /news/ukraine, /law-making/bill_under_consideration
  { path: ':category/:subcategory', component: CategoryPageComponent },

  // Обробляє шляхи типу: /news, /man_law, /ukrainian_law
  { path: ':category', component: CategoryPageComponent },

  // 4. Перенаправлення для неіснуючих сторінок (має бути в самому кінці)
  { path: '**', redirectTo: '' },
];
