import { execSync } from "node:child_process";
import type { Server } from "node:http";
import { config } from "dotenv";
import { resolve } from "path";
import { writeFileSync, unlinkSync, existsSync } from "fs";

// Explicitly load the .env.test file
// Use { override: true } to force loading even if variables already exist
config({ path: resolve(__dirname, '.env.test'), override: true });

// Save test variables in constants
const TEST_DATABASE_URL = process.env.DATABASE_URL;
const TEST_POSTGRES_PORT = process.env.POSTGRES_PORT;
const TEST_POSTGRES_USER = process.env.POSTGRES_USER;
const TEST_POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const TEST_POSTGRES_DB = process.env.POSTGRES_DB;
const TEST_PORT = process.env.PORT;

// ================================================================================
// Purpose of this file: set up the integration test environment
// This file is used as globalSetup in vitest.config.ts
// It exports setup() and teardown() functions that Vitest calls automatically
// ================================================================================

// HTTP test server
let server: Server | null = null;
let prismaInstance: any = null;

// Cross-platform wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function called by Vitest before ALL tests
export async function setup() {
  // Replace .env BEFORE importing app.ts
  // because app.ts loads dotenv/config which will use the .env from the directory
  const originalEnvPath = resolve(__dirname, '../../.env');
  const backupEnvPath = resolve(__dirname, '../../.env.bak');
  
  // Backup the original .env
  if (existsSync(originalEnvPath)) {
    execSync(`cp ${originalEnvPath} ${backupEnvPath}`, { stdio: 'ignore' });
  }
  
  // Write the test .env
  writeFileSync(originalEnvPath, `DATABASE_URL=${TEST_DATABASE_URL}\nPORT=${TEST_PORT}\n`);
  
  // Remove the old test container if it exists
  try {
    execSync(`docker rm -f blablabook-test`, { stdio: 'ignore' });
  } catch (error) {
    console.log('No existing test container to remove');
  }

  // Start a PostgreSQL container for tests
  execSync(`docker run -d --name blablabook-test -p ${TEST_POSTGRES_PORT}:5432 -e POSTGRES_USER=${TEST_POSTGRES_USER} -e POSTGRES_PASSWORD=${TEST_POSTGRES_PASSWORD} -e POSTGRES_DB=${TEST_POSTGRES_DB} postgres:17-alpine`);

  // Wait for PostgreSQL to be ready
  await wait(2000);

  try {
    // Apply the database schema
    execSync(`npx prisma db push --skip-generate`, {
      stdio: 'inherit',
    });
  } finally {
    // Restore the original .env after prisma db push
    if (existsSync(backupEnvPath)) {
      execSync(`cp ${backupEnvPath} ${originalEnvPath}`, { stdio: 'ignore' });
      unlinkSync(backupEnvPath);
    } else {
      unlinkSync(originalEnvPath);
    }
  }

  // Set environment variables for subsequent imports
  process.env.DATABASE_URL = TEST_DATABASE_URL;
  process.env.PORT = TEST_PORT;

  // Dynamically import app and prisma AFTER configuring the environment
  // This ensures PrismaClient uses the correct DATABASE_URL
  const appModule = await import("../../src/app");
  const prismaModule = await import("../../src/utils/prisma.utils");
  const app = appModule.default;
  prismaInstance = prismaModule.prisma;
  
  // Start the Express server
  server = app.listen(TEST_PORT);
  
  // Wait for the server to be ready
  await wait(500);

  // Store references in the global context for teardown
  globalThis.__TEST_SERVER__ = server;
  globalThis.__TEST_PRISMA__ = prismaInstance;
}

// Function called by Vitest after ALL tests
export async function teardown() {
  // Stop the HTTP server
  if (globalThis.__TEST_SERVER__) {
    (globalThis.__TEST_SERVER__ as Server).close();
  }

  // Disconnect Prisma
  if (globalThis.__TEST_PRISMA__) {
    await globalThis.__TEST_PRISMA__.$disconnect();
  }

  // Stop and remove the test container
  try {
    execSync(`docker rm -f blablabook-test`, { stdio: 'ignore' });
  } catch (error) {
    console.log('Error removing test container:', error);
  }
}
