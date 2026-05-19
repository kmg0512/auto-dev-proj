import { Test, TestingModule } from '@nestjs/testing';
import { GuildsController } from './guilds.controller';
import { GuildsService } from './guilds.service';

describe('GuildsController', () => {
  let controller: GuildsController;
  let service: GuildsService;

  const mockGuildsService = {
    createGuild: jest.fn(),
    joinGuild: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuildsController],
      providers: [
        { provide: GuildsService, useValue: mockGuildsService },
      ],
    }).compile();

    controller = module.get<GuildsController>(GuildsController);
    service = module.get<GuildsService>(GuildsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a guild', async () => {
      const name = 'Dragon Slayers';
      const result = { id: '1', name, bossHp: 10000 };
      mockGuildsService.createGuild.mockResolvedValue(result);

      expect(await controller.create(name)).toEqual(result);
      expect(service.createGuild).toHaveBeenCalledWith(name);
    });
  });

  describe('join', () => {
    it('should join a guild', async () => {
      const id = 'guild-1';
      const userId = 'user-1';
      const result = { id: userId, guildId: id };
      mockGuildsService.joinGuild.mockResolvedValue(result);

      expect(await controller.join(id, userId)).toEqual(result);
      expect(service.joinGuild).toHaveBeenCalledWith(userId, id);
    });
  });

  describe('getMembers', () => {
    it('should return list of guild members', async () => {
      const guildId = 'guild-1';
      const members = [
        { id: 'user-1', name: 'Alice', level: 5 },
        { id: 'user-2', name: 'Bob', level: 3 },
      ];
      // This will fail because getGuildMembers is not implemented in mock and controller
      (mockGuildsService as any).getGuildMembers = jest.fn().mockResolvedValue(members);

      expect(await (controller as any).getMembers(guildId)).toEqual(members);
      expect((service as any).getGuildMembers).toHaveBeenCalledWith(guildId);
    });
  });

  describe('getRaidStatus', () => {
    it('should return the current HP and status of the raid', async () => {
      const guildId = 'guild-1';
      const bossHp = 8000;
      
      (mockGuildsService as any).getGuildBossHp = jest.fn().mockResolvedValue(bossHp);

      const result = await (controller as any).getRaidStatus(guildId);
      expect(result).toEqual({ guildId, bossHp });
      expect(service.getGuildBossHp).toHaveBeenCalledWith(guildId);
    });
  });
});
