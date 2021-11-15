import type { ILogin, IAuthenticated, IGuestLogin } from '@/typings';
import { guestLogin } from '.';
import { api } from './api';
import { login, refreshToken } from './auth';

let jwtToken: IAuthenticated | null = null;

export function clearJwtToken() {
  jwtToken = null;
}

const isExpired = (jwtToken: IAuthenticated) => +new Date(jwtToken.expiry) - +new Date() <= 30 * 1000;

export async function getJwtToken(payload?: ILogin | IGuestLogin) {
  if (!jwtToken || isExpired(jwtToken)) {
    const request = payload ? ('uid' in payload ? guestLogin(payload.uid) : login(payload)) : refreshToken();
    jwtToken = await request;
  }
  return jwtToken;
}

const excludeUrls = ['/auth/login', '/auth/register', '/auth/refresh-token', '/guest/login', '/guest/register'];

api.interceptors.request.use(async config => {
  if (config.url && !excludeUrls.includes(config.url) && jwtToken) {
    const { token } = await getJwtToken();
    if (config.headers) {
      config.headers['Authorization'] = 'bearer ' + token;
    }
  }
  return config;
});
