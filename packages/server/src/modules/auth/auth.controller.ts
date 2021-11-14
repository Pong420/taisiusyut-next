import { nanoid } from 'nanoid';
import { Request, Response } from 'express';
import {
  Body,
  Post,
  Req,
  Res,
  Controller,
  UseGuards,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '@/modules/users/dto';
import { UsersService } from '@/modules/users/users.service';
import { User } from '@/modules/users/schemas/user.schema';
import { IAuthenticated, ICreateRefreshToken, IJWTSignPayload } from '@/typings';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshToken } from './schemas/refreshToken.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    const { user } = req;
    if (!user) throw new InternalServerErrorException(`user is ${user}`);

    const token = this.refreshTokenService.getCookie(req) || nanoid();
    const refreshToken: ICreateRefreshToken = {
      refreshToken: token,
      user: user.id
    };

    await this.refreshTokenService.updateOne({ refreshToken: token }, refreshToken, { upsert: true });

    const response: IAuthenticated = {
      ...this.authService.signJwt(user)
    };

    this.refreshTokenService.setCookie(res, token).status(HttpStatus.OK).send(response);
  }

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Post('/refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const tokenFromCookies = this.refreshTokenService.getCookie(req);

    if (tokenFromCookies) {
      const newRefreshToken = nanoid();
      const refreshToken: RefreshToken | null = await this.refreshTokenService.findOneAndUpdate(
        { refreshToken: tokenFromCookies },
        { refreshToken: newRefreshToken }
      );

      if (refreshToken) {
        const user = await this.userService.findOne({ _id: refreshToken.user });

        if (user) {
          const { id, username, nickname } = user.toJSON();
          const signPayload: IJWTSignPayload = { id, username, nickname };
          const signResult = this.authService.signJwt(signPayload);
          const response: IAuthenticated = {
            ...signResult
          };
          return this.refreshTokenService.setCookie(res, newRefreshToken).status(HttpStatus.OK).send(response);
        }
      }

      return res.status(HttpStatus.BAD_REQUEST).send(new BadRequestException('invalid refresh token'));
    }
  }

  @Post('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req, res);
  }
}
