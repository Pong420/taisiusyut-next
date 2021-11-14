import { Request } from 'express';
import { CacheInterceptor, Controller, Get, NotFoundException, Req, UseInterceptors } from '@nestjs/common';
import { getScraper } from './scraper/providers';

@Controller('book')
@UseInterceptors(CacheInterceptor)
export class BookController {
  @Get('/:provider?')
  search(@Req() req: Request) {
    const q = req.query.q;
    const scraper = getScraper(req.params.provider);

    if (typeof q === 'string' && scraper) {
      return scraper.searchBooks(q);
    }

    throw new NotFoundException();
  }
}
