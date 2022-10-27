import { z } from 'zod';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export const ChapterItem = z.object({
  id: z.string(),
  name: z.string()
});

export type IChapterItem = z.infer<typeof ChapterItem>;

export const BaseBookInfo = z.object({
  id: z.string(),
  name: z.string(),
  author: z.string(),
  category: z.string().default(''),
  description: z.string(),
  status: z.string(),
  latest: z.string(),
  lastUpdate: z.string(),
  cover: z.string()
});

export type IBaseBookInfo = z.infer<typeof BaseBookInfo>;

export const BookInfo = BaseBookInfo.extend({
  chapters: ChapterItem.array()
});

export type IBookInfo = z.infer<typeof BookInfo>;

export const ChapterContent = z.object({
  name: z.string(),
  content: z.string(),
  prev: z.string().optional(),
  next: z.string().optional()
});

export type IChapterContent = z.infer<typeof ChapterContent>;

export interface ProviderOptions {
  api: AxiosRequestConfig;
}

export abstract class Provider {
  api: AxiosInstance;

  constructor({ api: apiOptions }: ProviderOptions) {
    this.api = axios.create({
      ...apiOptions
    });
  }

  abstract search(query: string): Promise<IBaseBookInfo[]>;
  abstract getBook(id: string): Promise<IBookInfo>;
  abstract getChapters(id: string): Promise<IChapterItem[]>;
  abstract getChapterContent(bookId: string, chapterId: string): Promise<IChapterContent>;
}
