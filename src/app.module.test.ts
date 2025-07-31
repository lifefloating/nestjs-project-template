import { describe, it, expect } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

describe('AppModule', () => {
  let module: TestingModule;

  it('should compile the module', async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(AppModule)).toBeInstanceOf(AppModule);
  });

  it('should have required modules imported', async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Test that key modules are available
    expect(module.get(ConfigModule)).toBeDefined();
    expect(module.get(PrismaModule)).toBeDefined();
    expect(module.get(UsersModule)).toBeDefined();
  });
});
