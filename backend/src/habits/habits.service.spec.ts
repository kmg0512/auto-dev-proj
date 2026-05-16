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

  const mockPrismaService = {
    habit: {
      create: jest.fn().mockResolvedValue(mockHabit),
      findMany: jest.fn().mockResolvedValue([mockHabit]),
      findUnique: jest.fn().mockResolvedValue(mockHabit),
      update: jest.fn().mockResolvedValue(mockHabit),
      delete: jest.fn().mockResolvedValue(mockHabit),
    },
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
      expect(prisma.habit.create).toHaveBeenCalledWith({ data: createDto });
    });
  });

  describe('findAll', () => {
    it('should return an array of habits', async () => {
      const result = await service.findAll('user-id');
      expect(result).toEqual([mockHabit]);
      expect(prisma.habit.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-id' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single habit', async () => {
      const result = await service.findOne('habit-id');
      expect(result).toEqual(mockHabit);
      expect(prisma.habit.findUnique).toHaveBeenCalledWith({
        where: { id: 'habit-id' },
      });
    });
  });

  describe('update', () => {
    it('should update a habit', async () => {
      const updateDto = { title: 'Run' };
      const result = await service.update('habit-id', updateDto);
      expect(result).toEqual(mockHabit);
      expect(prisma.habit.update).toHaveBeenCalledWith({
        where: { id: 'habit-id' },
        data: updateDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a habit', async () => {
      const result = await service.remove('habit-id');
      expect(result).toEqual(mockHabit);
      expect(prisma.habit.delete).toHaveBeenCalledWith({
        where: { id: 'habit-id' },
      });
    });
  });
});
