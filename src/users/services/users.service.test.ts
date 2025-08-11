import { beforeEach, describe, expect, it, mock } from 'bun:test';
import type { PrismaService } from '@app/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import type { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from './users.service';

// Mock bcrypt
void mock.module('bcryptjs', () => ({
  hash: mock(() => Promise.resolve('hashed-password')),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  // Mock Prisma client
  const mockPrismaService = {
    user: {
      findMany: mock(),
      findUnique: mock(),
      create: mock(),
    },
  };

  beforeEach(() => {
    prismaService = mockPrismaService as any;
    service = new UsersService(prismaService);

    // Reset mocks
    mockPrismaService.user.findMany.mockReset();
    mockPrismaService.user.findUnique.mockReset();
    mockPrismaService.user.create.mockReset();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const expectedUsers = [
        {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: Role.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(expectedUsers);

      const result = await service.findAll();

      expect(result).toEqual(expectedUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const expectedUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(expectedUser);

      const result = await service.findOne('1');

      expect(result).toEqual(expectedUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('999')).rejects.toThrow('User with ID 999 not found');
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const expectedUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'Test',
        lastName: 'User',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(expectedUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(expectedUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findByEmail('nonexistent@example.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'newuser@example.com',
      password: 'plaintext-password',
      firstName: 'New',
      lastName: 'User',
    };

    it('should create a new user successfully', async () => {
      const expectedUser = {
        id: '2',
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock user doesn't exist
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      // Mock successful creation
      mockPrismaService.user.create.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'newuser@example.com',
          password: 'hashed-password',
          firstName: 'New',
          lastName: 'User',
          role: Role.USER,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it('should throw ConflictException when user already exists', async () => {
      const existingUser = {
        id: '1',
        email: 'newuser@example.com',
        password: 'existing-password',
        firstName: 'Existing',
        lastName: 'User',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createUserDto)).rejects.toThrow(
        'User with email newuser@example.com already exists',
      );
    });
  });
});
