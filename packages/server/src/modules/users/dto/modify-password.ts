import { ValidateIf, IsString, IsNotEmpty } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { IModifyPassword } from '@/typings';
import { IsPassword } from '@/decorators/is-password';

export class ModifyPasswordDto implements IModifyPassword {
  @IsString()
  @IsNotEmpty()
  password: string;

  @ValidateIf((o: ModifyPasswordDto) => {
    if (o.password === o.newPassword) {
      throw new BadRequestException('The new password you entered is the same as your old password');
    }
    return true;
  })
  @IsPassword()
  newPassword: string;
}
