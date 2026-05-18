import { Test, TestingModule } from '@nestjs/testing';
import { QuestsService } from './quests.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../prisma/redis.service';

describe('QuestsService', () => {
  let service: QuestsService;
  let prisma: PrismaService;
  let redis: RedisService;

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

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<QuestsService>(QuestsService);
    prisma = module.get<PrismaService>(PrismaService);
    redis = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateQuestFromHabit', () => {
    const habitId = 'habit-1';
    const userId = 'user-1';
    const habitData = { id: habitId, title: 'Drink water', userId };

    it('should create a quest and cache the result on cache miss', async () => {
      const expectedAiResponse = { 
        title: `The Quest for ${habitData.title}`, 
        description: `In a realm far away, you must fulfill your destiny by: ${habitData.title}.` 
      };

      mockRedisService.get.mockResolvedValue(null);
      mockPrismaService.habit.findUnique.mockResolvedValue(habitData);
      mockPrismaService.quest.create.mockResolvedValue({
        id: 'quest-1',
        ...expectedAiResponse,
        userId,
        isCompleted: false,
      });

      const result = await service.generateQuestFromHabit(habitId);

      expect(result.title).toBe(expectedAiResponse.title);
      expect(redis.get).toHaveBeenCalledWith(`ai:quest:${habitData.title}`);
      expect(redis.set).toHaveBeenCalledWith(
        `ai:quest:${habitData.title}`,
        JSON.stringify(expectedAiResponse),
        3600
      );
    });

    it('should return cached quest if available in Redis', async () => {
      const cachedResponse = {
        title: 'Cached Hydration Quest',
        description: 'Waters from the cache.'
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(cachedResponse));
      mockPrismaService.habit.findUnique.mockResolvedValue(habitData);
      mockPrismaService.quest.create.mockResolvedValue({
        id: 'quest-cached',
        ...cachedResponse,
        userId,
        isCompleted: false,
      });

      const result = await service.generateQuestFromHabit(habitId);

      expect(result.title).toBe(cachedResponse.title);
      expect(redis.get).toHaveBeenCalledWith(`ai:quest:${habitData.title}`);
      expect(prisma.quest.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          title: cachedResponse.title
        })
      }));
    });
  });
});
