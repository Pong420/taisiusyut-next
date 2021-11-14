import { CreatedAt } from './common';

export interface IUser extends CreatedAt {
  id: string;
  email: string;
  username: string;
  password: string;
  nickname: string;
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
