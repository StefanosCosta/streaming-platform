import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret-key'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should retrieve JWT_SECRET from config service', () => {
    expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
  });

  describe('validate', () => {
    it('should return user object with userId and username', async () => {
      const payload = {
        sub: 'user-123',
        username: 'testuser',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-123',
        username: 'testuser',
      });
    });

    it('should extract sub as userId', async () => {
      const payload = {
        sub: 'test-user-id',
        username: 'john',
      };

      const result = await strategy.validate(payload);

      expect(result.userId).toBe('test-user-id');
    });

    it('should extract username from payload', async () => {
      const payload = {
        sub: 'user-456',
        username: 'jane_doe',
      };

      const result = await strategy.validate(payload);

      expect(result.username).toBe('jane_doe');
    });

    it('should handle payload with additional fields', async () => {
      const payload = {
        sub: 'user-789',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-789',
        username: 'admin',
      });
    });

    it('should handle payload without username as undefined', async () => {
      const payload = {
        sub: 'user-999',
      };

      const result = await strategy.validate(payload);

      expect(result.userId).toBe('user-999');
      expect(result.username).toBeUndefined();
    });

    it('should throw UnauthorizedException for payload without sub', async () => {
      const payload = {
        username: 'testuser',
      };

      await expect(strategy.validate(payload)).rejects.toThrow(
        'Invalid token payload: missing sub field',
      );
    });

    it('should throw UnauthorizedException for empty payload', async () => {
      const payload = {};

      await expect(strategy.validate(payload)).rejects.toThrow(
        'Invalid token payload: missing sub field',
      );
    });

    it('should throw UnauthorizedException for null payload', async () => {
      const payload = null;

      await expect(strategy.validate(payload)).rejects.toThrow(
        'Invalid token payload: missing sub field',
      );
    });

    it('should throw UnauthorizedException for undefined payload', async () => {
      const payload = undefined;

      await expect(strategy.validate(payload)).rejects.toThrow(
        'Invalid token payload: missing sub field',
      );
    });
  });
});
