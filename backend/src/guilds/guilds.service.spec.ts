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
      const initialGuild = { id: guildId, bossHp: 9000 };
      const updatedGuild = { id: guildId, bossHp: 8500 };

      mockPrismaService.guild.findUnique.mockResolvedValue(initialGuild);
      mockPrismaService.guild.update.mockResolvedValue(updatedGuild);

      const result = await (service as any).attackGuildBoss(guildId, damage);
      expect(result).toBe(8500);
    });

    it('should buffer attacks and not update DB immediately when buffering is enabled', async () => {
      const guildId = 'guild-1';
      const damage = 100;
      
      mockPrismaService.guild.update.mockClear();

      // Mock current HP in buffer/DB
      mockPrismaService.guild.findUnique.mockResolvedValue({ id: guildId, bossHp: 10000 });

      // We expect the service to handle buffering.
      // For the sake of RED test, we expect it NOT to call prisma.guild.update immediately.
      await service.attackGuildBoss(guildId, damage);
      
      expect(prisma.guild.update).not.toHaveBeenCalled();
    });

    it('should aggregate damage and flush to DB', async () => {
      const guildId = 'guild-1';
      const damage1 = 100;
      const damage2 = 200;
      
      mockPrismaService.guild.update.mockClear();
      mockPrismaService.guild.findUnique.mockResolvedValue({ id: guildId, bossHp: 10000 });

      await service.attackGuildBoss(guildId, damage1);
      await service.attackGuildBoss(guildId, damage2);

      // Trigger manual flush for testing
      if ((service as any).flushDamageBuffer) {
        await (service as any).flushDamageBuffer();
      }

      expect(prisma.guild.update).toHaveBeenCalledWith({
        where: { id: guildId },
        data: {
          bossHp: {
            decrement: damage1 + damage2,
          },
        },
      });
    });
  });
});
