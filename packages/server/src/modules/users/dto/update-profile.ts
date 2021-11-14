import { IsEmail, IsOptional } from 'class-validator';
import { IUpdateProfile } from '@/typings';
import { IsNickname } from './index';

export class UpdateProfileDto implements IUpdateProfile {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsNickname()
  @IsOptional()
  nickname?: string;
}
