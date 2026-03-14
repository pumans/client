// models/article.ts
// Єдине місце визначення типів для статей та категорій

export interface Article {
  id: number;
  title: string;
  date: string;
  imageUrl: string | null;
  summary?: string | null;
  content?: string | null;
  breadcrumbs?: Breadcrumb[];
  seo?: SeoMeta | null;
}

export interface Breadcrumb {
  name: string;
  link: string;
}

export interface SeoMeta {
  title: string | null;
  description: string | null;
  ogImage: string | null;
  canonical: string | null;
}

export interface ArticleListResponse {
  categoryName: string;
  articles: Article[];
  total: number;
  currentPage: number;
  totalPages: number;
}
