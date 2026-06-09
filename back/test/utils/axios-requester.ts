import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import jwt from 'jsonwebtoken';
import type { User } from '../../src/utils/prisma.utils';

// Base URL of the test API
export const apiBaseUrl = `http://localhost:${process.env.PORT || 7357}/api`;

// =============================================================================
// JWT token generation for tests
// Replicates the logic from auth.service.ts
// =============================================================================

/**
 * Generates a JWT token for a user
 * Uses the same secret and expiration as the backend
 */
export function generateTestToken(payload: {
  id: number;
  username: string;
  email: string;
}): string {
  const secret = process.env.JWT_SECRET || 'test_jwt_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  });
}

// =============================================================================
// Test authentication middleware
// =============================================================================

/**
 * Creates a middleware that manually adds the token to cookies
 * This avoids the need to login via /auth/login for each test
 */
function createCookieHeader(token: string): { Cookie: string } {
  return {
    Cookie: `token=${token}; Path=/api; SameSite=Lax`,
  };
}

// =============================================================================
// Utilities for creating fake users
// =============================================================================

/**
 * Counter for fake user IDs
 */
let fakeUserId = 0;

/**
 * Creates a fake user with default values
 * @param overrides - Properties to override
 * @returns A User object with a unique incremental ID
 */
export function generateFakeUser(overrides: Partial<User> = {}): User {
  fakeUserId++;
  return {
    id: fakeUserId,
    username: `testuser${fakeUserId}`,
    email: `testuser${fakeUserId}@example.com`,
    password: 'TestPassword123!', // Valid password according to backend regex
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Creates a fake user with a valid JWT token
 */
export function generateFakeUserWithToken(overrides: Partial<User> = {}): User & { token: string } {
  const user = generateFakeUser(overrides);
  const token = generateTestToken({
    id: user.id,
    username: user.username,
    email: user.email,
  });

  return {
    ...user,
    token,
  };
}

// =============================================================================
// Preconfigured Axios requesters
// =============================================================================

/**
 * Creates an Axios requester with a JWT token in cookies
 * @param token - The JWT token to use
 * @returns A configured Axios instance
 */
function createRequesterWithToken(token: string): AxiosInstance {
  return axios.create({
    baseURL: apiBaseUrl,
    headers: createCookieHeader(token),
    validateStatus: () => true, // Do not throw error on 4XX/5XX
  });
}

/**
 * Creates an authenticated Axios requester for a user
 * @param user - The user with their token
 * @returns A preconfigured Axios instance with authentication cookies
 */
export function buildAuthedRequester(user: {
  id: number;
  username: string;
  email: string;
  token?: string;
}): AxiosInstance {
  const token =
    user.token ||
    generateTestToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

  return createRequesterWithToken(token);
}

/**
 * Creates an Axios requester for an automatically generated fake user
 */
export function createFakeAuthedRequester(overrides: Partial<User> = {}): {
  requester: AxiosInstance;
  user: User & { token: string };
} {
  const userWithToken = generateFakeUserWithToken(overrides);
  const requester = createRequesterWithToken(userWithToken.token);

  return {
    requester,
    user: userWithToken,
  };
}

// =============================================================================
// Library test utilities
// =============================================================================

/**
 * Creates a user via the /auth/register API and returns an authenticated requester
 * with real cookies obtained from the server
 */
export async function createAndAuthUser(
  userData: Partial<{
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }> = {}
): Promise<{ requester: AxiosInstance; user: User; cleanup: () => Promise<void> }> {
  // Create a fake user
  const fakeUser = generateFakeUser();
  const username = userData.username || fakeUser.username;
  const email = userData.email || fakeUser.email;
  const password = userData.password || fakeUser.password;

  // Create the user via the API
  const registerResponse = await axios.post(`${apiBaseUrl}/auth/register`, {
    username,
    email,
    password,
    confirmPassword: password,
  });

  // Login to get cookies
  const loginResponse = await axios.post(
    `${apiBaseUrl}/auth/login`,
    { email, password },
    { withCredentials: true }
  );

  // Create a requester with cookies
  // Note: In test mode, axios does not automatically handle cookies
  // between requests. You must either use a cookie jar or extract
  // the token from the Set-Cookie and re-inject it.
  //
  // For simplicity, we use the manually generated token (simpler approach for tests)
  const userWithToken = {
    id: registerResponse.data.data.id,
    username: registerResponse.data.data.username,
    email: registerResponse.data.data.email,
    token: generateTestToken({
      id: registerResponse.data.data.id,
      username: registerResponse.data.data.username,
      email: registerResponse.data.data.email,
    }),
  };

  const requester = createRequesterWithToken(userWithToken.token);

  // Cleanup function to delete the user after the test
  async function cleanup() {
    try {
      await requester.delete(`/users/${userWithToken.id}`);
    } catch {
      // Ignore cleanup errors
    }
  }

  return {
    requester,
    user: { ...fakeUser, ...userWithToken },
    cleanup,
  };
}

/**
 * Creates multiple authenticated users for tests
 */
export async function createAndAuthUsers(count: number) {
  const results = [];

  for (let i = 0; i < count; i++) {
    const result = await createAndAuthUser();
    results.push(result);
  }

  return results;
}

// =============================================================================
// Base requester (without authentication)
// =============================================================================

export const baseRequester = axios.create({
  baseURL: apiBaseUrl,
  validateStatus: () => true,
});
