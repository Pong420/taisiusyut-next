import { api } from './api';
import { ILogin, IAuthenticated, IRegister } from '@/typings';

export const login = (params: ILogin) => api.post<IAuthenticated>('/auth/login', params);

export const register = (params: IRegister) => api.post<IAuthenticated>('/auth/register', params);

export const refreshToken = () => api.post<IAuthenticated>('/auth/refresh-token');
