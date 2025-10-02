import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    // Mock authentication - accepts any credentials
    // In production, you would:
    // 1. Query database for user by email
    // 2. Verify password hash using bcrypt
    // 3. Check user status (active/banned)
    // 4. Handle failed login attempts

    // Generate a mock user ID from email for consistent tokens
    const userId = Buffer.from(loginDto.email).toString('base64').substring(0, 16);

    const payload = {
      sub: userId,
      username: loginDto.email.split('@')[0], // Extract username from email
      email: loginDto.email,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: '1d',
    };
  }
}
