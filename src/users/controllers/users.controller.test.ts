import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import type { CreateUserDto } from '../dto/create-user.dto';
import type { UsersService } from '../services/users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  // Mock UsersService
  const mockUsersService = {
    findAll: mock(),
    findOne: mock(),
    create: mock(),
  };

  beforeEach(() => {
    usersService = mockUsersService as any;
    controller = new UsersController(usersService);

    // Reset mocks
    mockUsersService.findAll.mockReset();
    mockUsersService.findOne.mockReset();
    mockUsersService.create.mockReset();
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

      mockUsersService.findAll.mockResolvedValue(expectedUsers);

      const result = await controller.findAll();

      expect(result).toEqual(expectedUsers);
      expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
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

      mockUsersService.findOne.mockResolvedValue(expectedUser);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUsersService.findOne.mockRejectedValue(
        new NotFoundException('User with ID 999 not found'),
      );

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'newuser@example.com',
      password: 'password123',
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

      mockUsersService.create.mockResolvedValue(expectedUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw ConflictException when user already exists', async () => {
      mockUsersService.create.mockRejectedValue(
        new ConflictException('User with email newuser@example.com already exists'),
      );

      await expect(controller.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });
});
