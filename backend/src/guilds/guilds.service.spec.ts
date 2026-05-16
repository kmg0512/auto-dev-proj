import { Test, TestingModule } from '@nestjs/testing';
import { GuildsService } from './guilds.service';
import { PrismaService } from '../prisma/prisma.service';

describe('GuildsService', () => {
  let service: GuildsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    guild: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuildsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<GuildsService>(GuildsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGuild', () => {
    it('should create a new guild', async () => {
      const guildData = { name: 'Dragon Slayers' };
      const createdGuild = { id: 'guild-1', ...guildData, bossHp: 10000 };
      
      mockPrismaService.guild.create.mockResolvedValue(createdGuild);

      const result = await service.createGuild(guildData.name);
      expect(result).toEqual(createdGuild);
      expect(prisma.guild.create).toHaveBeenCalledWith({
        data: { name: guildData.name },
      });
    });
  });

  describe('joinGuild', () => {
    it('should add a user to a guild', async () => {
      const userId = 'user-1';
      const guildId = 'guild-1';
      const updatedUser = { id: userId, guildId };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.joinGuild(userId, guildId);
      expect(result).toEqual(updatedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { guildId },
      });
    });
  });
});
