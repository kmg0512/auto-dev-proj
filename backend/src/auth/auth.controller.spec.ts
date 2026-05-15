import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return token for valid user', async () => {
      const user = { id: '1', email: 'test@example.com' };
      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue({ access_token: 'token' });

      const result = await controller.login('test@example.com');
      expect(result).toEqual({ access_token: 'token' });
    });

    it('should throw UnauthorizedException for invalid user', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.login('invalid@example.com')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should register and return token', async () => {
      const userData = { email: 'new@example.com', name: 'New User' };
      mockAuthService.register.mockResolvedValue({ access_token: 'token' });

      const result = await controller.register(userData);
      expect(result).toEqual({ access_token: 'token' });
      expect(mockAuthService.register).toHaveBeenCalledWith(userData);
    });
  });
});
