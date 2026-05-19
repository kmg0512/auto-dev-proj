import { Test, TestingModule } from '@nestjs/testing';
import { GuildsGateway } from './guilds.gateway';
import { GuildsService } from './guilds.service';
import { Server, Socket } from 'socket.io';

describe('GuildsGateway', () => {
  let gateway: GuildsGateway;
  let service: GuildsService;

  const mockGuildsService = {
    attackGuildBoss: jest.fn(),
  };
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
      // Providing a mock implementation to prevent errors during this legacy test case
      mockGuildsService.attackGuildBoss.mockResolvedValue(9950);
      
      const result = await gateway.handleAttackBoss(attackData);
      
      expect(mockServer.to).toHaveBeenCalledWith(`guild_raid_${attackData.guildId}`);
      expect(mockServer.emit).toHaveBeenCalledWith('bossAttacked', {
        userId: attackData.userId,
        damage: attackData.damage,
      });
      // The old test expects this, but we will update it in the next test cases
      // expect(result).toEqual({ event: 'attackAcknowledged', data: { damage: attackData.damage } });
    });

    it('should update boss HP and broadcast events', async () => {
      const attackData = { guildId: 'guild-1', damage: 50, userId: 'user-1' };
      const newHp = 9950;
      mockGuildsService.attackGuildBoss.mockResolvedValue(newHp);

      const result = await gateway.handleAttackBoss(attackData);
      
      expect(service.attackGuildBoss).toHaveBeenCalledWith(attackData.guildId, attackData.damage);
      expect(mockServer.to).toHaveBeenCalledWith(`guild_raid_${attackData.guildId}`);
      expect(mockServer.emit).toHaveBeenCalledWith('bossHpUpdated', {
        newHp: newHp,
      });
      expect(result).toEqual({ 
        event: 'attackAcknowledged', 
        data: { damage: attackData.damage, newHp: newHp } 
      });
    });

    it('should broadcast bossDefeated when HP reaches 0', async () => {
      const attackData = { guildId: 'guild-1', damage: 10000, userId: 'user-1' };
      const newHp = 0;
      mockGuildsService.attackGuildBoss.mockResolvedValue(newHp);

      await gateway.handleAttackBoss(attackData);
      
      expect(mockServer.emit).toHaveBeenCalledWith('bossDefeated', {
        guildId: attackData.guildId,
        defeatedBy: attackData.userId,
      });
    });
  });

  describe('handleChatMessage', () => {
    it('should broadcast message to the guild room', () => {
      const chatData = { guildId: 'guild-1', message: 'Hello Guild!', userId: 'user-1', userName: 'Alice' };
      
      const result = (gateway as any).handleChatMessage(chatData);
      
      expect(mockServer.to).toHaveBeenCalledWith(`guild_chat_${chatData.guildId}`);
      expect(mockServer.emit).toHaveBeenCalledWith('chatMessage', {
        userId: chatData.userId,
        userName: chatData.userName,
        message: chatData.message,
        timestamp: expect.any(String),
      });
      expect(result).toEqual({ event: 'messageSent', data: chatData.message });
    });
  });
});