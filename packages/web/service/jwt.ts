import type { ILogin, IAuthenticated } from '@/typings';
import { api } from './api';
import { routes } from './routes';
import { login } from './auth';

let jwtToken: IAuthenticated | null = null;

export function clearJwtToken() {
  jwtToken = null;
}

const isExpired = (jwtToken: IAuthenticated) => +new Date(jwtToken.expiry) - +new Date() <= 30 * 1000;

// TODO: FIXME
export async function getJwtToken(payload?: ILogin) {
  if (!jwtToken || isExpired(jwtToken)) {
    const request = payload ? login(payload) : Promise.reject();
    jwtToken = await request;
  }
  return jwtToken;
}

const excludeUrls = [routes.login, routes.register];

api.interceptors.request.use(async config => {
  if (config.url && !excludeUrls.includes(config.url) && jwtToken) {
    const { token } = await getJwtToken();
    if (config.headers) {
      config.headers['Authorization'] = 'bearer ' + token;
    }
  }
  return config;
});
