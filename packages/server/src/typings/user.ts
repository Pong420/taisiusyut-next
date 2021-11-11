import { Timestamp } from './common';

export interface IUser extends Timestamp {
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
