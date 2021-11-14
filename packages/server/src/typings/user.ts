import { CreatedAt } from './common';

export interface IUser extends IProfile {
  password: string;
}

export interface IProfile extends CreatedAt {
  id: string;
  email: string;
  username: string;
  nickname: string;
  guest?: boolean;
}

export interface ICreateUser {
  email: string;
  username: string;
  password: string;
}

export interface IUpdateProfile {
  email?: string;
  nickname?: string;
}

export interface IModifyPassword {
  password: string;
  newPassword: string;
}
