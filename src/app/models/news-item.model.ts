export interface NewsItem {
  id: number;
  name: string;
  detailUrl: string;
  previewPicture: {
    src: string;
    alt: string;
  };
  shortName: string;
}
