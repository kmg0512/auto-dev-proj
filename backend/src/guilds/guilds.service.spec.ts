import { Test, TestingModule } from '@nestjs/testing';
import { GuildsService } from './guilds.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../prisma/redis.service';

describe('GuildsService', () => {
  let service: GuildsService;
  let prisma: PrismaService;
  let redis: RedisService;

  const mockPrismaService = {
    guild: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
  };

  const mockRedisService = {
    hincrby: jest.fn(),
    hgetall: jest.fn(),
    hdel: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuildsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<GuildsService>(GuildsService);
    prisma = module.get<PrismaService>(PrismaService);
    redis = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('attackGuildBoss', () => {
    it('should use Redis hincrby for damage buffering', async () => {
      const guildId = 'guild-1';
      const damage = 500;
      
      mockPrismaService.guild.findUnique.mockResolvedValue({ id: guildId, bossHp: 10000 });
      
      await service.attackGuildBoss(guildId, damage);
      
      expect(mockRedisService.hincrby).toHaveBeenCalledWith(
        'guild:damage_buffer',
        guildId,
        damage,
      );
    });
  });

  describe('flushDamageBuffer', () => {
    it('should pull from Redis and update DB', async () => {
      const guildId = 'guild-1';
      const damage = 300;
      
      mockRedisService.hgetall.mockResolvedValue({ [guildId]: damage.toString() });

      await (service as any).flushDamageBuffer();

      expect(prisma.guild.update).toHaveBeenCalledWith({
        where: { id: guildId },
        data: { bossHp: { decrement: damage } },
      });
      expect(mockRedisService.hdel).toHaveBeenCalledWith('guild:damage_buffer', guildId);
    });
  });
});
