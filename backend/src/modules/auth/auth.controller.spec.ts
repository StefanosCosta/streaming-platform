import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
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
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with loginDto', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Test123!@#',
      };

      const mockResponse = {
        access_token: 'mock-token',
        token_type: 'Bearer',
        expires_in: '1d',
      };

      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockResponse);
    });

    it('should return access token on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'user@test.com',
        password: 'SecurePass1!',
      };

      const expectedResponse = {
        access_token: 'jwt-token-here',
        token_type: 'Bearer',
        expires_in: '1d',
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('token_type', 'Bearer');
      expect(result).toHaveProperty('expires_in', '1d');
    });

    it('should handle different email formats', async () => {
      const loginDto: LoginDto = {
        email: 'john.doe@company.co.uk',
        password: 'ValidPass1!',
      };

      mockAuthService.login.mockResolvedValue({
        access_token: 'token',
        token_type: 'Bearer',
        expires_in: '1d',
      });

      await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
