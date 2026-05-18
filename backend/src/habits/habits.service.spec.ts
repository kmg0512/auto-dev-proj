import { Test, TestingModule } from '@nestjs/testing';
import { HabitsService } from './habits.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HabitsService', () => {
  let service: HabitsService;
  let prisma: PrismaService;

  const mockHabit = {
    id: 'habit-id',
    title: 'Exercise',
    description: 'Go to the gym',
    frequency: 'daily',
    userId: 'user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    name: 'Test User',
    streak: 5,
    level: 1,
    exp: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    habit: {
      create: jest.fn().mockResolvedValue(mockHabit),
      findMany: jest.fn().mockResolvedValue([mockHabit]),
      findUnique: jest.fn().mockResolvedValue(mockHabit),
      update: jest.fn().mockResolvedValue(mockHabit),
      delete: jest.fn().mockResolvedValue(mockHabit),
    },
    user: {
      findUnique: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue(mockUser),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HabitsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<HabitsService>(HabitsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new habit', async () => {
      const createDto = {
        title: 'Exercise',
        description: 'Go to the gym',
        frequency: 'daily',
        userId: 'user-id',
      };
      const result = await service.create(createDto);
      expect(result).toEqual(mockHabit);
      expect(prisma.habit.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of habits', async () => {
      const result = await service.findAll('user-id');
      expect(result).toEqual([mockHabit]);
      expect(prisma.habit.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single habit', async () => {
      const result = await service.findOne('habit-id');
      expect(result).toEqual(mockHabit);
      expect(prisma.habit.findUnique).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a habit', async () => {
      const updateDto = { title: 'Run' };
      const result = await service.update('habit-id', updateDto);
      expect(result).toEqual(mockHabit);
      expect(prisma.habit.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a habit', async () => {
      const result = await service.remove('habit-id');
      expect(result).toEqual(mockHabit);
      expect(prisma.habit.delete).toHaveBeenCalled();
    });
  });

  describe('recoverStreak', () => {
    it('should increment user streak when ad is watched', async () => {
      const result = await (service as any).recoverStreak('user-id');
      expect(result).toBeDefined();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: { streak: { increment: 1 } },
      });
    });
  });
});
