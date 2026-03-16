import axios from 'axios';

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export interface GoogleBook {
  id: string;
  title: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  isbn10?: string;
  isbn13?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  imageLink?: string;
  language?: string;
}

function mapVolumeToBook(volume: Record<string, unknown>): GoogleBook {
  const info = (volume.volumeInfo ?? {}) as Record<string, unknown>;
  const identifiers =
    (info.industryIdentifiers as Array<{ type: string; identifier: string }>) ?? [];

  return {
    id: volume.id as string,
    title: info.title as string,
    authors: info.authors as string[] | undefined,
    publisher: info.publisher as string | undefined,
    publishedDate: info.publishedDate as string | undefined,
    description: info.description as string | undefined,
    isbn10: identifiers.find((i) => i.type === 'ISBN_10')?.identifier,
    isbn13: identifiers.find((i) => i.type === 'ISBN_13')?.identifier,
    pageCount: info.pageCount as number | undefined,
    categories: info.categories as string[] | undefined,
    averageRating: info.averageRating as number | undefined,
    ratingsCount: info.ratingsCount as number | undefined,
    imageLink: (info.imageLinks as Record<string, string> | undefined)?.thumbnail,
    language: info.language as string | undefined,
  };
}

export async function searchBooks(query: string, maxResults = 20): Promise<GoogleBook[]> {
  const response = await axios.get(BASE_URL, {
    params: { q: query, maxResults, key: process.env.GOOGLE_BOOKS_API_KEY },
  });

  const items = (response.data.items ?? []) as Record<string, unknown>[];
  return items.map(mapVolumeToBook);
}

export async function getBookById(googleId: string): Promise<GoogleBook> {
  const response = await axios.get(`${BASE_URL}/${googleId}`, {
    params: { key: process.env.GOOGLE_BOOKS_API_KEY },
  });

  return mapVolumeToBook(response.data as Record<string, unknown>);
}
