import { describe, expect, it } from 'bun:test';

describe('Application', () => {
  it('should have proper module structure', () => {
    // Test basic imports work
    expect(() => require('./app.module')).not.toThrow();
    expect(() => require('./config/config.module')).not.toThrow();
    expect(() => require('./prisma/prisma.module')).not.toThrow();
    expect(() => require('./users/users.module')).not.toThrow();
  });

  it('should have proper service structure', () => {
    // Test basic service imports work
    expect(() => require('./config/config.service')).not.toThrow();
    expect(() => require('./users/services/users.service')).not.toThrow();
  });

  it('should have proper controller structure', () => {
    // Test basic controller imports work
    expect(() => require('./users/controllers/users.controller')).not.toThrow();
  });
});
