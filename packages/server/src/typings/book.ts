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
  nextChapter: string;
  prevChapter: string;
  paragraph: string[];
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
