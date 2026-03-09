import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Головна сторінка та статичні сторінки (можна пререндерити для максимальної швидкості)
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'editor_column', renderMode: RenderMode.Prerender },

  // Сторінка конкретної статті (завжди рендеримо на сервері, щоб SEO бачило свіжі дані)
  { path: 'article/:id', renderMode: RenderMode.Server },

  // Наші нові універсальні категорії (теж рендеримо на сервері для SEO)
  { path: ':category/:subcategory', renderMode: RenderMode.Server },
  { path: ':category', renderMode: RenderMode.Server },

  // Всі інші невідомі маршрути (404) також обробляємо на сервері
  { path: '**', renderMode: RenderMode.Server },
];
