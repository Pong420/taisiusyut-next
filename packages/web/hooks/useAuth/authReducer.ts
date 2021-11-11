import { Reducer } from 'react';
import { IJWTSignPayload, IUser } from '@/typings';

export type LoginStatus = 'unknown' | 'loading' | 'loggedIn' | 'required';

export interface LoggedIn {
  loginStatus: 'loggedIn';
  user: IJWTSignPayload & Partial<IUser>;
}

export interface NotLoggedIn {
  loginStatus: Exclude<LoginStatus, LoggedIn['loginStatus']>;
  user: null;
}

export type AuthState = LoggedIn | NotLoggedIn;

export type AuthActionsTypes =
  | { type: 'AUTHENTICATE' }
  | { type: 'AUTHENTICATE_SUCCESS'; payload: LoggedIn['user'] }
  | { type: 'AUTHENTICATE_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'PROFILE_UPDATE'; payload: Partial<IUser> };

export interface LogoutOptions {
  slient?: boolean;
}

export const initialState: AuthState = {
  loginStatus: 'unknown',
  user: null
};

export const authReducer: Reducer<AuthState, AuthActionsTypes> = (prevState, action) => {
  switch (action.type) {
    case 'AUTHENTICATE':
      return {
        ...prevState,
        user: null,
        loginStatus: 'loading'
      };
    case 'AUTHENTICATE_SUCCESS':
      return {
        ...prevState,
        user: action.payload,
        loginStatus: 'loggedIn'
      };
    case 'AUTHENTICATE_FAILURE':
    case 'LOGOUT':
      return {
        ...prevState,
        user: null,
        loginStatus: 'required'
      };
    case 'PROFILE_UPDATE':
      return {
        ...prevState,
        loginStatus: 'loggedIn',
        user: {
          ...prevState.user,
          ...action.payload
        } as LoggedIn['user']
      };

    default:
      throw new Error('Incorrect action');
  }
};
