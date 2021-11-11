import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export function IsNickname() {
  return applyDecorators(IsString(), IsNotEmpty(), MaxLength(15));
}

export * from './create-user.dto';
