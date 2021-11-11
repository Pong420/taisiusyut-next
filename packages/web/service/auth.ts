import { api } from './api';
import { routes } from './routes';
import { ILogin, IAuthenticated, IRegister } from '@/typings';

export const login = (params: ILogin) => api.post<IAuthenticated>(routes.login, params);

export const register = (params: IRegister) => api.post<IAuthenticated>(routes.register, params);
