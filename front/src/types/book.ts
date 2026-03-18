interface Book {
  id: string;
  volumeInfo: {
    title: string;
    averageRating?: number;
    imageLinks?: {
      thumbnail?: string;
    };
  };
}
