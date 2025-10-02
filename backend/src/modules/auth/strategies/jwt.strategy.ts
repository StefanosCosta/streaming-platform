import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: any) {
    // Validate required field: sub (user identifier)
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload: missing sub field');
    }

    // Mock validation - in production, you'd validate against a database
    // Production systems should:
    // 1. Validate user exists in database
    // 2. Check user status (active/banned)
    // 3. Verify additional claims (roles, permissions)
    // 4. Implement token refresh logic
    return { userId: payload.sub, username: payload.username };
  }
}