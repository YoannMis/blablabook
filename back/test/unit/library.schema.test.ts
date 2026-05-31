import { describe, it, expect } from 'vitest';
import { getUserLibraryQuerySchema } from '../../src/schema/library.schema';

describe('GET /api/library - Query parameter validation', () => {
  describe('Query parameter validation', () => {
    it('should successfully parse valid query parameters (status=read, page=2, limit=10)', () => {
      // Arrange
      const queryParams = { status: 'read', page: 2, limit: 10 };

      // Act
      const result = getUserLibraryQuerySchema.safeParse(queryParams);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          status: 'read',
          page: 2,
          limit: 10,
        });
      }
    });

    it('should successfully parse partial query parameters (page=2 only) with defaults', () => {
      // Arrange
      const queryParams = { page: 2 };

      // Act
      const result = getUserLibraryQuerySchema.safeParse(queryParams);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          status: 'all',
          page: 2,
          limit: 20,
        });
      }
    });

    it('should fail parsing with invalid page (0)', () => {
      // Arrange
      const queryParams = { page: 0 };

      // Act
      const result = getUserLibraryQuerySchema.safeParse(queryParams);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Too small: expected number to be >=1');
      }
    });
  });
});
