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
