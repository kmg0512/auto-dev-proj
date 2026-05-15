import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if found', async () => {
      const user = { id: '1', email: 'test@example.com', name: 'Test' };
      mockUsersService.findOneByEmail.mockResolvedValue(user);

      const result = await service.validateUser('test@example.com');
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      const result = await service.validateUser('notfound@example.com');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { id: '1', email: 'test@example.com', name: 'Test' };
      mockJwtService.sign.mockReturnValue('test-token');

      const result = await service.login(user);
      expect(result).toEqual({
        access_token: 'test-token',
      });
    });
  });

  describe('register', () => {
    it('should create a user and return an access token', async () => {
      const userData = { email: 'new@example.com', name: 'New User' };
      const user = { id: '2', ...userData };
      mockUsersService.create.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('new-token');

      const result = await service.register(userData);
      expect(result).toEqual({ access_token: 'new-token' });
      expect(mockUsersService.create).toHaveBeenCalledWith(userData);
    });
  });
});
