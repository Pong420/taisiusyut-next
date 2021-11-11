import { CreatedAt } from './common';

export interface IUser extends CreatedAt {
  id: string;
  email: string;
  username: string;
  password: string;
  nickname: string;
  books: string[];
}

export interface ICreateUser {
  email: string;
  username: string;
  password: string;
}
