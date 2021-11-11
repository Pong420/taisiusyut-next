import { nanoid } from 'nanoid';
import { Request, Response } from 'express';
import { Body, Controller, Post, Req, UseGuards, InternalServerErrorException, Res, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '@/modules/users/dto';
import { UsersService } from '@/modules/users/users.service';
import { User } from '@/modules/users/schemas/user.schema';
import { IAuthenticated } from '@/typings';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';

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

    const refreshToken = this.refreshTokenService.getCookie(req) || nanoid();

    await this.refreshTokenService.updateOne(
      { refreshToken },
      {
        refreshToken,
        userId: user.userId
      },
      { upsert: true }
    );

    const response: IAuthenticated = {
      ...this.authService.signJwt(user)
    };

    this.refreshTokenService.setCookie(res, refreshToken).status(HttpStatus.OK).send(response);
  }

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }
}
