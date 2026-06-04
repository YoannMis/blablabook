import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Load environment variables from .env.test
    envFile: './test/config/.env.test',
    
    // Global setup file to run before/after ALL tests
    globalSetup: './test/config/global-setup.ts',
    
    // Setup file to include in each test for before/after EACH test hooks
    setupFiles: ['./test/config/test-setup.ts'],
    
    // Do not stop on first failure
    passWithNoTests: false,
    
    // Timeout for tests (useful for integration tests)
    testTimeout: 15000,
    
    // Include test files
    include: ['test/**/*.test.ts', 'test/**/*.spec.ts'],
    
    // Exclude certain files
    exclude: ['node_modules/', 'dist/'],
    
    // Code coverage (optional)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'test/', 'generated/', 'src/types/'],
    },
  },
  resolve: {
    alias: {
      // Alias for easy importing from src
      '@': path.resolve(__dirname, './src'),
      '@test': path.resolve(__dirname, './test'),
    },
  },
});
