import { Timestamp } from './common';

export interface IBook {
  id: string;
  bookID: string;
  name: string;
  author: string;
  cover?: string;
  description: string;
  latestChapter: string;
  provider: string;
}

export interface IBookDetails extends Omit<IBook, 'id'> {
  chapters: IChapter[];
}

export interface IChapter {
  name: string;
  id: string;
  no: number;
}

export interface IChapterContent {
  name: string;
  paragraph: string[];
  nextChapter: string | null;
  prevChapter: string | null;
}

export interface ISearchResult {
  bookID: string;
  name: string;
  author: string;
  status: string;
  latestChapter: string;
  updatedAt: number;
  provider: string;
}

export interface IBookPayload {
  bookID: string;
  provider: string;
}

export interface IGetChapters {
  bookName: string;
  provider: string;
}

export interface IGetChapterContent {
  chapterNo: number;
  bookName: string;
  provider: string;
}

export interface IBookShelf extends Timestamp {
  id: string;
  book: IBook;
  lastVistChapter?: number;
}

export interface IUpdateBookShelf {
  lastVistChapter?: number;
}
