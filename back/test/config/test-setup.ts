import { beforeEach } from 'vitest';
import { config } from 'dotenv';
import { resolve } from 'path';
import { prisma } from '../../src/utils/prisma.utils';

// Explicitly load the .env.test file
// Use { override: true } to force loading even if variables already exist
config({ path: resolve(__dirname, '.env.test'), override: true });

// beforeEach hook: runs once before each test
beforeEach(async () => {
  // Suppress console.info logs during tests
  const originalInfo = console.info;
  console.info = () => {};
  
  // Truncate all tables
  await prisma.$executeRawUnsafe(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE "' || r.tablename || '" RESTART IDENTITY CASCADE';
      END LOOP;
    END $$;
  `);
  
  // Restore console.info after cleanup
  console.info = originalInfo;
});
