import { Test, TestingModule } from '@nestjs/testing';
import { GuildsGateway } from './guilds.gateway';
import { GuildsService } from './guilds.service';
import { Server, Socket } from 'socket.io';

describe('GuildsGateway', () => {
  let gateway: GuildsGateway;
  let service: GuildsService;

  const mockGuildsService = {};
  const mockServer = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  };
  const mockSocket = {
    join: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuildsGateway,
        { provide: GuildsService, useValue: mockGuildsService },
      ],
    }).compile();

    gateway = module.get<GuildsGateway>(GuildsGateway);
    service = module.get<GuildsService>(GuildsService);
    gateway.server = mockServer as any;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleJoinRaid', () => {
    it('should join the guild raid room', () => {
      const guildId = 'guild-1';
      const result = gateway.handleJoinRaid(guildId, mockSocket as any);
      
      expect(mockSocket.join).toHaveBeenCalledWith(`guild_raid_${guildId}`);
      expect(result).toEqual({ event: 'joinedRaid', data: guildId });
    });
  });

  describe('handleAttackBoss', () => {
    it('should broadcast bossAttacked event to the guild room', async () => {
      const attackData = { guildId: 'guild-1', damage: 50, userId: 'user-1' };
      const result = await gateway.handleAttackBoss(attackData);
      
      expect(mockServer.to).toHaveBeenCalledWith(`guild_raid_${attackData.guildId}`);
      expect(mockServer.emit).toHaveBeenCalledWith('bossAttacked', {
        userId: attackData.userId,
        damage: attackData.damage,
      });
      expect(result).toEqual({ event: 'attackAcknowledged', data: { damage: attackData.damage } });
    });
  });
});
