import cacheManager from 'cache-manager';
import { AxiosError } from 'axios';
import { Logger } from '@nestjs/common';
import { Scraper } from '../scraper';
import { name as bigquge, BiqugeScraper } from './bigquge';
import { name as biquyue, BiquyueScraper } from './biquyue';

export type ScraperName = keyof typeof scrapers;

export const DEFAULT_SCRAPER = biquyue;

export const scrapers: Record<string, Scraper> = {
  [bigquge]: new BiqugeScraper(),
  [biquyue]: new BiquyueScraper()
};

for (const key in scrapers) {
  enhanceScraper(scrapers[key]);
}

export function getScraper(name: ScraperName = DEFAULT_SCRAPER) {
  return scrapers[name] || scrapers[DEFAULT_SCRAPER];
}

const memoryCache = cacheManager.caching({ store: 'memory', ttl: 12 * 60 * 60 /*seconds*/ });

function enhanceScraper<T extends Scraper>(scraper: T) {
  function enhancer<F extends (...args: any[]) => Promise<R>, R>(fn: F) {
    const logger = new Logger(fn.name);
    let retry = 0;
    return async function run(...args: Parameters<F>): Promise<R> {
      try {
        logger.debug('start');
        const key = [scraper.name].concat(args as string[]).join('_');
        const result: R = await memoryCache.wrap(key, () => fn(...args));
        logger.debug('end');
        return result;
      } catch (error) {
        if (retry >= 10) throw error;
        retry += 1;
        logger.debug('retrying', (error as AxiosError).message);
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
