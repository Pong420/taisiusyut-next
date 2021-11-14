import { Request, Response } from 'express';
import { Body, Controller, ForbiddenException, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '@/modules/users/users.service';
import { AuthService } from '@/modules/auth/auth.service';
import { ModifyPasswordDto, UpdateProfileDto } from '@/modules/users/dto';

@Controller()
export class UsersController {
  constructor(private userService: UsersService, private authService: AuthService) {}

  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  async Profile(@Req() req: Request) {
    return this.userService.findOne({ _id: req.user?.id });
  }

  @Patch('/profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Req() req: Request, @Body() payload: UpdateProfileDto) {
    return this.userService.findOneAndUpdate({ _id: req.user?.id }, payload);
  }

  @Patch('/modify-password')
  @UseGuards(AuthGuard('jwt'))
  async modifyPassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() { password, newPassword }: ModifyPasswordDto
  ) {
    const isValid = await this.authService.validateUser(req.user?.username || '', password);
    if (!isValid) throw new ForbiddenException('invalid username or password');
    await this.userService.findOneAndUpdate({ _id: req.user?.id }, { password: newPassword });
    await this.logout(req, res);
  }

  @Post('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req, res);
  }
}
