import { customAlphabet } from 'nanoid';
import { Request, Response } from 'express';
import { classToPlain } from 'class-transformer';
import { Body, Post, Req, Res, Controller, UseGuards, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '@/modules/users/dto';
import { UsersService } from '@/modules/users/users.service';
import { AuthController } from './auth.controller';

export const nanoid = () => {
  const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
  return customAlphabet(str, 24)();
};

@Controller('guest')
export class GuestController {
  constructor(private authController: AuthController, private userService: UsersService) {}

  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response, @Body('uid') uid: string) {
    const user = await this.userService.findOne({ username: uid }, {});
    if (!user) throw new NotFoundException();

    Object.assign(req, { user: classToPlain(user.toJSON(), { excludePrefixes: ['_'] }) });

    return this.authController.login(req, res);
  }

  @Post('/register')
  async register() {
    const uid = nanoid();
    return this.authController.register({
      username: uid,
      password: uid,
      email: `${uid}@guest.io`,
      nickname: 'Guest',
      guest: true
    });
  }

  @Post('/connect')
  @UseGuards(AuthGuard('jwt'))
  async connect(@Req() req: Request, @Body() payload: CreateUserDto) {
    const user = this.userService.findOneAndUpdate(
      { _id: req.user?.id, guest: true },
      { ...payload, nickname: payload.username, $unset: { guest: 1 } },
      { new: true }
    );

    if (!user) throw new NotFoundException();
    return user;
  }
}
