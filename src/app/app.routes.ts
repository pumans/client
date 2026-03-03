import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ArticlePage } from './components/article-page/article-page';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'news/:id', component: ArticlePage },
  { path: '**', redirectTo: '' },
];
