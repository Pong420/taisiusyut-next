import { IBook, IBookPayload } from '@/typings';
import { api } from './api';

export const getBookShelf = () => api.get<IBook[]>('/book/shelf');

export const addBookToShelf = (payload: IBookPayload) => api.post<IBook>('/book', payload);

export const removeBookFromShelf = (id: string) => api.delete<IBook>(`/book/${id}`);
