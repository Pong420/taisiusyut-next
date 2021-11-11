export interface IBook {
  id: string;
  bookID: string;
  name: string;
  author: string;
  cover?: string;
  intro: string;
  latestChapter: string;
  provider: string;
}

export interface ISearchResult {
  bookID: string;
  name: string;
  author: string;
  status: string;
  latestChapter: string;
  updatedAt: number;
}

export interface IBookPayload {
  bookID: string;
  provider: string;
}
