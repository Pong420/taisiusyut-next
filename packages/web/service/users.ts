import { api } from './api';
import { IModifyPassword, IProfile, IUpdateProfile } from '@/typings';

export const getProfile = () => api.post<IProfile>('/profile');

export const updateProfile = (payload: IUpdateProfile) => api.patch<IProfile>('/profile', payload);

export const modifyPassword = (payload: IModifyPassword) =>
  api.patch<{ message: 'success' }>('/modify-password', payload);
