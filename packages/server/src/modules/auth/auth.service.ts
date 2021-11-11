import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@/config';
import { UsersService } from '@/modules/users/users.service';
import { IJWTSignPayload, IJWTSignResult } from '@/typings';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(username: string, pass: string): Promise<IJWTSignPayload | undefined> {
    const user = await this.usersService.findOne({ username }, { projection: '+password' });

    if (user) {
      const valid = await bcrypt.compare(pass, user.password);
      if (valid) {
        const { id: userId, password, ...result } = user.toJSON();
        return { userId, ...result };
      }
    }
  }

  signJwt(payload: IJWTSignPayload): IJWTSignResult {
    const now = +new Date();
    const user = payload;
    const minutes = this.configService.get<number>('JWT_TOKEN_EXPIRES_IN_MINUTES');

    if (!minutes) throw new InternalServerErrorException('jwt expires not configured');

    return {
      user,
      token: this.jwtService.sign(user),
      expiry: new Date(now + minutes * 60 * 1000)
    };
  }

  async login(payload: IJWTSignPayload) {
    return this.signJwt(payload);
  }
}
