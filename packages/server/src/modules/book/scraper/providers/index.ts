import cacheManager from 'cache-manager';
import { Scraper } from '../scraper';
import { name as bigquge, BiqugeScraper } from './bigquge';

export type ScraperName = keyof typeof scrapers;

const memoryCache = cacheManager.caching({ store: 'memory', ttl: 12 * 60 * 60 /*seconds*/ });

function enhanceScraper<T extends Scraper>(scraper: T) {
  function enhancer<F extends (...args: any[]) => Promise<R>, R>(fn: F) {
    let retry = 0;
    return async function run(...args: Parameters<F>): Promise<R> {
      try {
        const key = [scraper.name].concat(args as string[]).join('_');
        return await memoryCache.wrap(key, () => fn(...args));
      } catch (error) {
        if (retry >= 10) throw error;
        retry += 1;
        // eslint-disable-next-line
        console.log('retrying', fn.name, error);
        return await run(...args);
      }
    };
  }

  const getBook = scraper.getBook.bind(scraper);
  scraper.getBook = enhancer(getBook);

  const getChapters = scraper.getChapters.bind(scraper);
  scraper.getChapters = enhancer(getChapters);

  const getChapterContent = scraper.getChapterContent.bind(scraper);
  scraper.getChapterContent = enhancer(getChapterContent);

  const searchBooks = scraper.searchBooks.bind(scraper);
  scraper.searchBooks = enhancer(searchBooks);
}

export const scrapers: Record<string, Scraper> = {
  [bigquge]: new BiqugeScraper()
};

for (const key in scrapers) {
  enhanceScraper(scrapers[key]);
}

const DEFAULT_SCRAPER = bigquge;

export function getScraper(name: ScraperName = DEFAULT_SCRAPER) {
  return scrapers[name] || scrapers[DEFAULT_SCRAPER];
}
