import { Scraper } from '..';
import { name as bigquge, BiqugeScraper } from './bigquge';

export const scrapers: Record<string, Scraper> = {
  [bigquge]: new BiqugeScraper()
};
export type ScraperName = keyof typeof scrapers;

const defaultScraper = bigquge;

export function getScraper(name: ScraperName = defaultScraper) {
  return scrapers[name] || scrapers[defaultScraper];
}
