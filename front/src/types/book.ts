interface Book {
  id: string;
  volumeInfo: {
    title: string;
    description?: string;
    authors: string[];
    averageRating?: number;
    imageLinks?: {
      thumbnail?: string;
    };
    categories?: string[];
    language?: string;
    pageCount?: number;
    publisher?: string;
    industryIdentifiers?: {
      type: 'ISBN_10' | 'ISBN_13';
      identifier: string;
    }[];
  };
}
