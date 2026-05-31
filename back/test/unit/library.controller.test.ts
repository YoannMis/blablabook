import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserLibrary } from '../../src/controllers/library.controller';
import { getUserLibraryBooks } from '../../src/services/library.service';
import type { AuthRequest } from '../../src/middlewares/auth.middleware';

vi.mock('../../src/services/library.service', () => ({
  getUserLibraryBooks: vi.fn(),
  formatBooks: vi.fn((books) => books),
}));

describe('GET /api/library', () => {
  describe('Pagination', () => {
    let req: Partial<AuthRequest>;
    let res: any;
    let jsonSpy: any;

    beforeEach(() => {
      jsonSpy = vi.fn();
      res = { status: vi.fn(() => res), json: jsonSpy };
      req = { userId: 1, query: {} };
      vi.resetAllMocks();
    });

    it('should use default pagination values when no query parameters are provided', async () => {
      // Arrange
      const mockUserBooks = [];
      const mockTotal = 0;
      (getUserLibraryBooks as any).mockResolvedValue({
        userBooks: mockUserBooks,
        total: mockTotal,
      });

      // Act
      await getUserLibrary(req as AuthRequest, res);

      // Assert
      expect(getUserLibraryBooks).toHaveBeenCalledWith(1, 'all', 20, 0);
      expect(jsonSpy).toHaveBeenCalledWith({
        pagination: { total: 0, page: 1, hasNext: false, hasPrevious: false },
        data: mockUserBooks,
      });
    });

    it('should calculate pagination flags correctly for page 2 with limit 10 and total 25', async () => {
      // Arrange
      req = { userId: 1, query: { page: '2', limit: '10' } };
      const mockUserBooks = [];
      const mockTotal = 25;
      (getUserLibraryBooks as any).mockResolvedValue({
        userBooks: mockUserBooks,
        total: mockTotal,
      });

      // Act
      await getUserLibrary(req as AuthRequest, res);

      // Assert
      expect(getUserLibraryBooks).toHaveBeenCalledWith(1, 'all', 10, 10);
      expect(jsonSpy).toHaveBeenCalledWith({
        pagination: { total: 25, page: 2, hasNext: true, hasPrevious: true },
        data: mockUserBooks,
      });
    });

    it('should return 401 when userId is undefined', async () => {
      // Arrange
      req = { userId: undefined, query: {} };

      // Act
      await getUserLibrary(req as AuthRequest, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: false,
        message: 'User not authenticated',
      });
    });
  });
});
