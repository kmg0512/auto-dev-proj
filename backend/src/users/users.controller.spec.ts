import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile without sensitive data', async () => {
      const userId = 'user-1';
      const user = { id: userId, name: 'Alice', level: 5, exp: 50, email: 'alice@example.com' };
      const result = { id: userId, name: 'Alice', level: 5, exp: 50 };

      mockUsersService.findOne.mockResolvedValue(user);

      expect(await controller.getProfile(userId)).toEqual(result);
    });
  });
});
