import { Timestamp } from './common';
import { ICreateUser, IProfile } from './user';

export interface IJWTSignPayload extends Omit<IProfile, 'email' | keyof Timestamp> {}

export interface IJWTSignResult {
  user: IJWTSignPayload;
  token: string;
  expiry: Date | string;
}

export interface IValidatePayload extends IJWTSignPayload {
  exp: number;
}

export interface ICreateRefreshToken {
  user: string;
  refreshToken: string;
}

export interface IUpdateRefreshToken {
  refreshToken: string;
}

export interface IRefreshToken extends ICreateRefreshToken, Timestamp {
  id: string;
}

export interface ILogin {
  username: string;
  password: string;
}
export interface IRegister extends ICreateUser {}

export interface IAuthenticated extends IJWTSignResult {}
