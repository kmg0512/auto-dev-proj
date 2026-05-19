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
    guildInvitation: {
      create: jest.fn(),
      findUnique: jest.fn(),
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

  describe('inviteUser', () => {
    it('should create a guild invitation', async () => {
      const guildId = 'guild-1';
      const invitedUserId = 'user-2';
      const invitation = { id: 'inv-1', guildId, userId: invitedUserId, status: 'PENDING' };

      mockPrismaService.guildInvitation.create.mockResolvedValue(invitation);

      const result = await service.inviteUser(guildId, invitedUserId);
      expect(result).toEqual(invitation);
      expect(prisma.guildInvitation.create).toHaveBeenCalledWith({
        data: {
          guildId,
          userId: invitedUserId,
          status: 'PENDING',
        },
      });
    });
  });

  describe('acceptInvitation', () => {
    it('should update invitation status and join guild', async () => {
      const invitationId = 'inv-1';
      const guildId = 'guild-1';
      const userId = 'user-2';
      const invitation = { id: invitationId, guildId, userId, status: 'PENDING' };
      const updatedInvitation = { ...invitation, status: 'ACCEPTED' };

      mockPrismaService.guildInvitation.findUnique.mockResolvedValue(invitation);
      mockPrismaService.guildInvitation.update.mockResolvedValue(updatedInvitation);
      mockPrismaService.user.update.mockResolvedValue({ id: userId, guildId });

      const result = await service.acceptInvitation(invitationId, userId);
      
      expect(result.status).toBe('ACCEPTED');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { guildId },
      });
    });

    it('should throw error if invitation is invalid', async () => {
      const invitationId = 'inv-1';
      const userId = 'user-2';
      
      mockPrismaService.guildInvitation.findUnique.mockResolvedValue(null);

      await expect(service.acceptInvitation(invitationId, userId)).rejects.toThrow('Invalid invitation');
    });
  });

  describe('rejectInvitation', () => {
    it('should update invitation status to REJECTED', async () => {
      const invitationId = 'inv-1';
      const userId = 'user-2';
      const invitation = { id: invitationId, guildId: 'guild-1', userId, status: 'PENDING' };
      const updatedInvitation = { ...invitation, status: 'REJECTED' };

      mockPrismaService.guildInvitation.findUnique.mockResolvedValue(invitation);
      mockPrismaService.guildInvitation.update.mockResolvedValue(updatedInvitation);

      const result = await service.rejectInvitation(invitationId, userId);
      
      expect(result.status).toBe('REJECTED');
    });
  });
});
