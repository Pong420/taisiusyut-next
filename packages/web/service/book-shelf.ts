import { IBookPayload, IBookShelf, IUpdateBookShelf } from '@/typings';
import { api } from './api';

export const getBookShelf = () => api.get<IBookShelf[]>('/shelf');

export const addBookToShelf = (payload: IBookPayload) => api.post<IBookShelf>('/shelf', payload);

export const removeBookFromShelf = (id: string) => api.delete<void>(`/shelf/${id}`);

export const updateBookShelf = (id: string, payload: IUpdateBookShelf) => api.patch(`/shelf/${id}`, payload);

export const lastVistChapter = (id: string, lastVistChapter: number) => updateBookShelf(id, { lastVistChapter });
