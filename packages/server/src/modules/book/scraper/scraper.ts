import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CheerioAPI } from 'cheerio';
import { IBookDetails, IChapter, ISearchResult, IChapterContent } from '@/typings';
import { transformResponse } from './utils';

const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36""Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36';

interface ScraperAxiosInstance extends Omit<AxiosInstance, 'get'> {
  get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<CheerioAPI>>;
}

export abstract class Scraper {
  name: string;

  http: ScraperAxiosInstance;

  constructor(name: string, { headers, ...config }: AxiosRequestConfig = {}) {
    this.name = name;
    this.http = axios.create({
      headers: {
        'User-Agent': userAgent,
        ...headers
      },
      responseType: 'arraybuffer',
      transformResponse: [transformResponse],
      ...config
    });
  }

  abstract getBook(bookID: string): Promise<Omit<IBookDetails, 'id'>>;
  abstract getChapters(bookID: string): Promise<IChapter[]>;
  abstract getChapterContent(bookID: string, chapterID: string): Promise<IChapterContent>;
  abstract searchBooks(query: string): Promise<ISearchResult[]>;
}
