import { api } from './api';
import { ILogin, IAuthenticated, IRegister, IProfile } from '@/typings';

export const login = (payload: ILogin) => api.post<IAuthenticated>('/auth/login', payload);

export const register = (payload: IRegister) => api.post<IProfile>('/auth/register', payload);

export const refreshToken = () => api.post<IAuthenticated>('/auth/refresh-token');

export const logout = () => api.post<{ message: 'success' }>('/auth/logout');

export const guestLogin = (uid: string) => api.post<IAuthenticated>('/guest/login', { uid });

export const guestRegister = () => api.post<IProfile>('/guest/register');

export const guestConnect = (payload: IRegister) => api.post<IProfile>('/guest/connect', payload);
