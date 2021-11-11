import { Request } from 'express';
import { Controller, Get, Req } from '@nestjs/common';
import { getScraper } from './scraper/providers';

@Controller('book')
export class BookController {
  @Get('/search')
  search(@Req() req: Request) {
    const q = req.query.q;
    if (typeof q === 'string') {
      const scraper = getScraper();
      return scraper.searchBooks(q);
    }
    return [];
  }
}
