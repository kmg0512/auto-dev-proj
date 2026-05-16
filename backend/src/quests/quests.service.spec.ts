import { Test, TestingModule } from '@nestjs/testing';
import { QuestsService } from './quests.service';
import { PrismaService } from '../prisma/prisma.service';

describe('QuestsService', () => {
  let service: QuestsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    quest: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    habit: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<QuestsService>(QuestsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateQuestFromHabit', () => {
    it('should create a quest based on habit data using AI (mocked)', async () => {
      const habitId = 'habit-1';
      const userId = 'user-1';
      const habitData = { id: habitId, title: 'Drink water', userId };
      const aiResponse = { 
        title: `The Quest for ${habitData.title}`, 
        description: `In a realm far away, you must fulfill your destiny by: ${habitData.title}.` 
      };

      mockPrismaService.habit.findUnique.mockResolvedValue(habitData);
      mockPrismaService.quest.create.mockResolvedValue({
        id: 'quest-1',
        ...aiResponse,
        userId,
        isCompleted: false,
      });

      const result = await service.generateQuestFromHabit(habitId);

      expect(result.title).toBe(aiResponse.title);
      expect(result.description).toBe(aiResponse.description);
      expect(prisma.quest.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if habit does not exist', async () => {
      mockPrismaService.habit.findUnique.mockResolvedValue(null);

      await expect(service.generateQuestFromHabit('non-existent'))
        .rejects.toThrow('Habit with ID non-existent not found');
    });
  });
});
