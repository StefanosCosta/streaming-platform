import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        token_type: string;
        expires_in: string;
    }>;
}
