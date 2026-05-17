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

  describe('leveling', () => {
    it('should add experience to user', async () => {
      const id = '1';
      const initialUser = { id, exp: 0, level: 1 };
      const updatedUser = { id, exp: 50, level: 1 };
      mockPrismaService.user.findUnique.mockResolvedValue(initialUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await (service as any).addExperience(id, 50);
      expect(result.exp).toBe(50);
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });

    it('should level up when experience exceeds threshold', async () => {
      const id = '1';
      const initialUser = { id, exp: 90, level: 1 };
      const updatedUser = { id, exp: 10, level: 2 }; // Assuming 100 exp per level
      mockPrismaService.user.findUnique.mockResolvedValue(initialUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await (service as any).addExperience(id, 20);
      expect(result.level).toBe(2);
      expect(result.exp).toBe(10);
    });

    it('should throw an error if user is not found', async () => {
      const id = 'non-existent';
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect((service as any).addExperience(id, 10)).rejects.toThrow('User not found');
    });
  });
});
