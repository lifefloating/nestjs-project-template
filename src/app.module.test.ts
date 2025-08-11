import { describe, expect, it } from 'bun:test';

describe('Application', () => {
  it('should have proper module structure', async () => {
    // Test basic imports work
    expect(() => import('./app.module')).not.toThrow();
    expect(() => import('./config/config.module')).not.toThrow();
    expect(() => import('./prisma/prisma.module')).not.toThrow();
    expect(() => import('./users/users.module')).not.toThrow();
  });

  it('should have proper service structure', async () => {
    // Test basic service imports work
    expect(() => import('./config/config.service')).not.toThrow();
    expect(() => import('./users/services/users.service')).not.toThrow();
  });

  it('should have proper controller structure', async () => {
    // Test basic controller imports work
    expect(() => import('./users/controllers/users.controller')).not.toThrow();
  });
});
