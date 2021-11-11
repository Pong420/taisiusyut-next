import { IRegister } from '@/typings';
import { rid } from '@/utils/random';

export function createRegisterDto(payload?: Partial<IRegister>): IRegister {
  return { username: rid(8), password: 'pwd1' + rid(10), email: `${rid(8)}@taisiusyut.io`, ...payload };
}
