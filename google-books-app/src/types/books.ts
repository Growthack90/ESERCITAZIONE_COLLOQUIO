export interface BookVolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
  };
  infoLink: string;
}

export interface BookItem {
  id: string;
  volumeInfo: BookVolumeInfo;
}

export interface BooksApiResponse {
  kind: string;
  totalItems: number;
  items?: BookItem[];
}
