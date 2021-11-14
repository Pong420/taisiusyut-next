import { Request, Response } from 'express';
import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@/config';
import { UsersService } from '@/modules/users/users.service';
import { RefreshTokenService } from './refresh-token.service';
import { IJWTSignPayload, IJWTSignResult } from '@/typings';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
    private refreshTokenService: RefreshTokenService
  ) {}

  async validateUser(username: string, pass: string): Promise<IJWTSignPayload | undefined> {
    const user = await this.usersService.findOne({ username }, { projection: '+password' });

    if (user) {
      const valid = await bcrypt.compare(pass, user.password);
      if (valid) {
        const { id, password, ...result } = user.toJSON();
        return { id, ...result };
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

  async logout(req: Request, res: Response) {
    await this.refreshTokenService.deleteToken(req);
    return this.refreshTokenService
      .setCookie(res, '', {
        httpOnly: true,
        expires: new Date(0)
      })
      .status(HttpStatus.OK)
      .send({ message: 'success' });
  }
}
