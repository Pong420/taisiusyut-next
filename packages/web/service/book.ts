import { IGetChapters, IGetChapterContent, IChapter, IChapterContent } from '@/typings';
import { api } from './api';

export interface SearchBook {
  value: string;
  provider?: string;
}

export const searchBook = ({ value, provider }: SearchBook) => {
  let path = '/book';
  if (provider) path += `${path}/${provider}`;
  return api.get(path, { params: { q: value } });
};

export const getChapters = ({ provider, bookName }: IGetChapters) => {
  return api.get<IChapter[]>(`/chapter/${provider}/${bookName}`);
};

export const getChapterContent = ({ provider, bookName, chapterNo }: IGetChapterContent) => {
  return api.get<IChapterContent>(`/chapter/${provider}/${bookName}/${chapterNo}`);
};
