import { describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { prisma } from '../../src/utils/prisma.utils';
import { generateTestToken, apiBaseUrl } from '../utils/axios-requester';

describe('GET /api/library - Integration tests', () => {
  describe('Library retrieval', () => {
    let userId: number;
    let token: string;
    let bookIds: number[] = [];

    beforeEach(async () => {
      // Create test user
      const user = await prisma.user.create({
        data: {
          username: 'test_library_user',
          email: 'test_library@integration.com',
          password: 'TestPassword123!',
        },
      });
      userId = user.id;

      // Create test publisher (required for Book.publisherId)
      const publisher = await prisma.publisher.upsert({
        where: { name: 'Integration Test Publisher' },
        create: { name: 'Integration Test Publisher' },
        update: {},
      });

      // Create 5 books
      const books = [];
      for (let i = 0; i < 5; i++) {
        const book = await prisma.book.create({
          data: {
            title: `Integration Test Book ${i + 1}`,
            googleBookId: `integration_test_${i + 1}`,
            publisherId: publisher.id,
          },
        });
        books.push(book);
        bookIds.push(book.id);
      }

      // Create userBook relations: 3 read, 2 wishlist
      await prisma.userBook.createMany({
        data: [
          { userId, bookId: bookIds[0], status: 'read' },
          { userId, bookId: bookIds[1], status: 'read' },
          { userId, bookId: bookIds[2], status: 'read' },
          { userId, bookId: bookIds[3], status: 'wishlist' },
          { userId, bookId: bookIds[4], status: 'wishlist' },
        ],
      });

      // Generate JWT token for authentication
      token = generateTestToken({
        id: userId,
        username: user.username,
        email: user.email,
      });
    });

    it('should return all 5 books for authenticated user with 3 read and 2 wishlist', async () => {
      // Arrange: Create authenticated requester
      const requester = axios.create({
        baseURL: apiBaseUrl,
        headers: { Cookie: `token=${token}; Path=/api; SameSite=Lax` },
        validateStatus: () => true,
      });

      // Act: Get user library
      const response = await requester.get('/library');

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.data).toHaveLength(5);
      expect(response.data.data.filter((book: any) => book.status === 'read')).toHaveLength(3);
      expect(response.data.data.filter((book: any) => book.status === 'wishlist')).toHaveLength(2);
      expect(response.data.pagination).toEqual({
        total: 5,
        page: 1,
        hasNext: false,
        hasPrevious: false,
      });
    });
  });
});
