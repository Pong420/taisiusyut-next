import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional } from 'class-validator';
import { IsPassword } from '@/decorators/is-password';
import { IsUsername } from '@/decorators/is-username';
import { ICreateUser } from '@/typings';
import { IsNickname } from './index';

export class CreateUserDto implements ICreateUser {
  @Exclude()
  id?: string;

  @IsEmail()
  email: string;

  @IsUsername()
  username: string;

  @IsPassword()
  password: string;

  @IsOptional()
  @IsNickname()
  nickname?: string;

  @IsBoolean()
  @IsOptional()
  guest?: boolean;
}
