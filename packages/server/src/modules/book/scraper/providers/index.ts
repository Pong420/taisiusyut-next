import cacheManager from 'cache-manager';
import { Scraper } from '../scraper';
import { name as bigquge, BiqugeScraper } from './bigquge';

export type ScraperName = keyof typeof scrapers;

const memoryCache = cacheManager.caching({ store: 'memory', ttl: 10 * 60 /*seconds*/ });

function withCache<T extends Scraper>(scraper: T) {
  const cacheKey = (...args: string[]) => [scraper.name].concat(args).join('_');

  const getBook = scraper.getBook.bind(scraper);
  scraper.getBook = (bookID: string) => memoryCache.wrap(cacheKey(bookID), () => getBook(bookID));

  const getChapters = scraper.getChapters.bind(scraper);
  scraper.getChapters = (bookID: string) => memoryCache.wrap(cacheKey(bookID), () => getChapters(bookID));

  const getChapterContent = scraper.getChapterContent.bind(scraper);
  scraper.getChapterContent = (bookID: string, chapterID: string) =>
    memoryCache.wrap(cacheKey(bookID, chapterID), () => getChapterContent(bookID, chapterID));

  const searchBooks = scraper.searchBooks.bind(scraper);
  scraper.searchBooks = (query: string) => memoryCache.wrap(cacheKey(query), () => searchBooks(query));
}

export const scrapers: Record<string, Scraper> = {
  [bigquge]: new BiqugeScraper()
};

for (const key in scrapers) {
  withCache(scrapers[key]);
}

const DEFAULT_SCRAPER = bigquge;

export function getScraper(name: ScraperName = DEFAULT_SCRAPER) {
  return scrapers[name] || scrapers[DEFAULT_SCRAPER];
}
