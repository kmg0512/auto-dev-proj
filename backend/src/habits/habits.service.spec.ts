import { Test, TestingModule } from '@nestjs/testing';
import { HabitsService } from './habits.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { GuildsService } from '../guilds/guilds.service';

describe('HabitsService', () => {
  let service: HabitsService;
  let prisma: PrismaService;
  let usersService: UsersService;
  let guildsService: GuildsService;

  const mockHabit = {
    id: 'habit-id',
    title: 'Exercise',
    description: 'Go to the gym',
    frequency: 'daily',
    userId: 'user-id',
    user: {
      id: 'user-id',
      guildId: 'guild-id',
    },
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
    guildId: 'guild-id',
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

  const mockUsersService = {
    addExperience: jest.fn().mockResolvedValue(mockUser),
  };

  const mockGuildsService = {
    attackGuildBoss: jest.fn().mockResolvedValue(9995),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HabitsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: GuildsService,
          useValue: mockGuildsService,
        },
      ],
    }).compile();

    service = module.get<HabitsService>(HabitsService);
    prisma = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
    guildsService = module.get<GuildsService>(GuildsService);
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

  describe('recoverStreak', () => {
    it('should increment user streak when ad is watched', async () => {
      const result = await service.recoverStreak('user-id');
      expect(result).toBeDefined();
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });

  describe('completeHabit', () => {
    it('should trigger EXP gain and Guild Boss attack upon completion', async () => {
      const result = await (service as any).completeHabit('habit-id');
      
      expect(result).toBeDefined();
      // Should call UsersService to add EXP
      expect(usersService.addExperience).toHaveBeenCalledWith('user-id', 10);
      // Should call GuildsService to damage boss (if in guild)
      expect(guildsService.attackGuildBoss).toHaveBeenCalledWith('guild-id', 5);
    });
  });
});
