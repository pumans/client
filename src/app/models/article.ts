export interface Article {
  id: number;
  title: string;
  date: string; // ISO формат дати з JSON
  summary: string;
  content: string; // Тут буде HTML-верстка
  imageUrl: string;
}
