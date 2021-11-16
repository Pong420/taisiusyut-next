import { Request } from 'express';
import { CacheInterceptor, Controller, Get, Logger, NotFoundException, Req, UseInterceptors } from '@nestjs/common';
import { getScraper } from './scraper/providers';

@Controller('book')
@UseInterceptors(CacheInterceptor)
export class BookController {
  constructor(private readonly logger: Logger) {}

  @Get('/:provider?')
  async search(@Req() req: Request) {
    this.logger.debug(`Searching for ${req.query.q}`);

    const q = req.query.q;
    const scraper = getScraper(req.params.provider);

    if (typeof q === 'string' && scraper) {
      const result = await scraper.searchBooks(q);
      this.logger.debug(`Found ${result.length} results`);
      return result;
    }

    throw new NotFoundException();
  }
}
