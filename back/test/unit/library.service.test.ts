import { describe, it, expect } from 'vitest';
import { formatBooks } from '../../src/services/library.service';
import type { UserBookWithDetails } from '../../src/types/userBook.types';

describe('formatBooks', () => {
  describe('Book formatting', () => {
    it('should format a complete book with all properties', () => {
      // Arrange
      const userBooks: UserBookWithDetails[] = [
        {
          userId: 1,
          bookId: 1,
          status: 'read',
          book: {
            id: 1,
            title: 'Test Book',
            averageRating: 4.5,
            ratingCount: 100,
            imageLinks: {
              thumbnail: 'http://example.com/thumb.jpg',
              small: 'http://example.com/small.jpg',
            },
            language: 'en',
            description: 'A test book description',
            publishedDate: '2024-01-01',
            isbn10: '1234567890',
            isbn13: '1234567890123',
            pageCount: 300,
            publisherId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            authors: [{ author: { name: 'Author One' } }, { author: { name: 'Author Two' } }],
            publisher: { name: 'Test Publisher' },
            categories: [{ category: { name: 'Fiction' } }, { category: { name: 'Adventure' } }],
          },
        },
      ];

      // Act
      const result = formatBooks(userBooks);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].book.status).toBe('read');
      expect(result[0].book.authors).toEqual(['Author One', 'Author Two']);
      expect(result[0].book.publisher).toBe('Test Publisher');
      expect(result[0].book.categories).toEqual(['Fiction', 'Adventure']);
      expect(result[0].book.imageLinks).toEqual({
        thumbnail: 'http://example.com/thumb.jpg',
        small: 'http://example.com/small.jpg',
        medium: undefined,
        large: undefined,
      });
    });

    it('should format a book with missing optional properties', () => {
      // Arrange
      const userBooks: UserBookWithDetails[] = [
        {
          userId: 1,
          bookId: 2,
          status: 'wishlist',
          book: {
            id: 2,
            title: 'Incomplete Book',
            averageRating: null,
            ratingCount: null,
            imageLinks: null,
            language: null,
            description: null,
            publishedDate: null,
            isbn10: null,
            isbn13: null,
            pageCount: null,
            publisherId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            authors: null,
            publisher: null,
            categories: null,
          },
        },
      ];

      // Act
      const result = formatBooks(userBooks);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].book.title).toBe('Incomplete Book');
      expect(result[0].book.description).toBeNull();
      expect(result[0].book.imageLinks).toBeNull();
      expect(result[0].book.authors).toEqual([]);
      expect(result[0].book.publisher).toBeNull();
      expect(result[0].book.categories).toEqual([]);
    });
  });
});
