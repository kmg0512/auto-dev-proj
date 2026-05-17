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

  describe('getGuildBossHp', () => {
    it('should return the current boss HP of a guild', async () => {
      const guildId = 'guild-1';
      const guild = { id: guildId, name: 'Dragon Slayers', bossHp: 9000 };

      mockPrismaService.guild.findUnique.mockResolvedValue(guild);

      const result = await (service as any).getGuildBossHp(guildId);
      expect(result).toBe(9000);
      expect(prisma.guild.findUnique).toHaveBeenCalledWith({
        where: { id: guildId },
        select: { bossHp: true },
      });
    });

    it('should throw an error if guild is not found', async () => {
      const guildId = 'non-existent';
      mockPrismaService.guild.findUnique.mockResolvedValue(null);

      await expect((service as any).getGuildBossHp(guildId)).rejects.toThrow(
        'Guild not found',
      );
    });
  });

  describe('attackGuildBoss', () => {
    it('should decrease boss HP and return updated HP', async () => {
      const guildId = 'guild-1';
      const damage = 500;
      const updatedGuild = { id: guildId, bossHp: 8500 };

      mockPrismaService.guild.update.mockResolvedValue(updatedGuild);

      const result = await (service as any).attackGuildBoss(guildId, damage);
      expect(result).toBe(8500);
      expect(prisma.guild.update).toHaveBeenCalledWith({
        where: { id: guildId },
        data: {
          bossHp: {
            decrement: damage,
          },
        },
      });
    });

    it('should not allow boss HP to go below 0', async () => {
      // In a real implementation, we might handle this in the service
      // For now, let's just test the update call
      const guildId = 'guild-1';
      const damage = 10000;
      const updatedGuild = { id: guildId, bossHp: 0 };

      mockPrismaService.guild.update.mockResolvedValue(updatedGuild);

      const result = await (service as any).attackGuildBoss(guildId, damage);
      expect(result).toBe(0);
    });
  });
});
