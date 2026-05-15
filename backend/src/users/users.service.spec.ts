import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = { email: 'test@example.com', name: 'Test User' };
      mockPrismaService.user.create.mockResolvedValue({ id: '1', ...userData });

      const result = await service.create(userData);
      expect(result).toEqual({ id: '1', ...userData });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({ data: userData });
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', email, name: 'Test User' });

      const result = await service.findOneByEmail(email);
      expect(result).toEqual({ id: '1', email, name: 'Test User' });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email } });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const id = '1';
      mockPrismaService.user.findUnique.mockResolvedValue({ id, email: 'test@example.com', name: 'Test User' });

      const result = await service.findOne(id);
      expect(result).toEqual({ id, email: 'test@example.com', name: 'Test User' });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = '1';
      const updateData = { name: 'Updated Name' };
      mockPrismaService.user.update.mockResolvedValue({ id, email: 'test@example.com', ...updateData });

      const result = await service.update(id, updateData);
      expect(result).toEqual({ id, email: 'test@example.com', ...updateData });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = '1';
      mockPrismaService.user.delete.mockResolvedValue({ id, email: 'test@example.com', name: 'Test User' });

      const result = await service.remove(id);
      expect(result).toEqual({ id, email: 'test@example.com', name: 'Test User' });
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
