import { Request } from 'express';
import { CacheInterceptor, Controller, Get, Logger, NotFoundException, Req, UseInterceptors } from '@nestjs/common';
import { getScraper } from './scraper/providers';

@Controller('book')
@UseInterceptors(CacheInterceptor)
export class BookController {
  @Get('/:provider?')
  async search(@Req() req: Request) {
    Logger.debug(`Searching for ${req.query.q}`);

    const q = req.query.q;
    const scraper = getScraper(req.params.provider);

    if (typeof q === 'string' && scraper) {
      const result = await scraper.searchBooks(q);
      Logger.debug(`Found ${result.length} results`);
      return result;
    }

    throw new NotFoundException();
  }
}
