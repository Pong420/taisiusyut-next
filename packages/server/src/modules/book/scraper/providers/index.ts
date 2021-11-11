import { Scraper } from '..';
import { name as bigquge, BiqugeScraper } from './bigquge';

export type ScraperName = keyof typeof scrapers;

export const scrapers: Record<string, Scraper> = {
  [bigquge]: new BiqugeScraper()
};

const DEFAULT_SCRAPER = bigquge;

export function getScraper(name: ScraperName = DEFAULT_SCRAPER) {
  return scrapers[name] || scrapers[DEFAULT_SCRAPER];
}
