import { z } from 'zod';
import { getProvider } from '../provider';
import { t, publicProcedure } from '../trpc';

const searchInput = z.object({
  provider: z.string(),
  keyword: z.string()
});

const getBookInput = z.object({
  provider: z.string(),
  bookId: z.string()
});

const getChapterContentInput = getBookInput.extend({
  chapterId: z.string()
});

export const bookRouter = t.router({
  search: publicProcedure.input(searchInput).query(async ({ input }) => {
    const provider = getProvider(input.provider);
    const resp = await provider.search(input.keyword);
    return resp;
  }),
  get: publicProcedure.input(getBookInput).query(async ({ input }) => {
    const provider = getProvider(input.provider);
    const resp = await provider.getBook(input.bookId);
    return resp;
  }),
  chapters: publicProcedure.input(getBookInput).query(async ({ input }) => {
    const provider = getProvider(input.provider);
    const resp = await provider.getChapters(input.bookId);
    return resp;
  }),
  content: publicProcedure.input(getChapterContentInput).query(async ({ input }) => {
    const provider = getProvider(input.provider);
    const resp = await provider.getChapterContent(input.bookId, input.chapterId);
    return resp;
  })
});
