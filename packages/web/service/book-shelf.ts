import { IBook, IBookPayload } from '@/typings';
import { api } from './api';

export const getBookShelf = () => api.get<IBook[]>('/shelf');

export const addBookToShelf = (payload: IBookPayload) => api.post<IBook>('/shelf', payload);

export const removeBookFromShelf = (id: string) => api.delete<IBook>(`/shelf/${id}`);
