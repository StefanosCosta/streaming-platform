import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should generate a JWT token for valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Test123!@#',
      };

      const mockToken = 'mock-jwt-token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(loginDto);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: expect.any(String),
          username: 'test',
          email: 'test@example.com',
        }),
      );

      expect(result).toEqual({
        access_token: mockToken,
        token_type: 'Bearer',
        expires_in: '1d',
      });
    });

    it('should extract username from email', async () => {
      const loginDto: LoginDto = {
        email: 'john.doe@example.com',
        password: 'SecurePass1!',
      };

      mockJwtService.sign.mockReturnValue('token');

      await service.login(loginDto);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'john.doe',
          email: 'john.doe@example.com',
        }),
      );
    });

    it('should generate consistent userId for same email', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Test123!@#',
      };

      mockJwtService.sign.mockReturnValue('token');

      await service.login(loginDto);
      const firstCall = mockJwtService.sign.mock.calls[0][0];

      mockJwtService.sign.mockClear();

      await service.login(loginDto);
      const secondCall = mockJwtService.sign.mock.calls[0][0];

      expect(firstCall.sub).toBe(secondCall.sub);
    });

    it('should return token with correct structure', async () => {
      const loginDto: LoginDto = {
        email: 'user@test.com',
        password: 'ValidPass1!',
      };

      mockJwtService.sign.mockReturnValue('generated-token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('token_type', 'Bearer');
      expect(result).toHaveProperty('expires_in', '1d');
    });

    it('should accept any password (mock authentication)', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'AnyPassword1!',
      };

      mockJwtService.sign.mockReturnValue('token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token');
    });
  });
});
