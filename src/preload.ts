/**
 * Global test setup for Bun test runner
 * This file is preloaded before running tests as configured in bunfig.toml
 */

import { beforeAll, afterAll } from 'bun:test';

// Global test setup
beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = 'test';

  // Disable logging during tests to reduce noise
  process.env.LOG_LEVEL = 'silent';

  // Mock environment variables if needed
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'mongodb://localhost:27017/test-db';
  }

  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'test-jwt-secret';
  }

  console.log('🧪 Test environment initialized');
});

// Global test teardown
afterAll(() => {
  console.log('🧹 Test environment cleaned up');
});

// Global error handler for unhandled rejections during tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
