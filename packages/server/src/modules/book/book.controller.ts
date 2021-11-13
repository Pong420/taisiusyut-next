import { Request } from 'express';
import { Controller, Get, NotFoundException, Req } from '@nestjs/common';
import { getScraper } from './scraper/providers';

@Controller('book')
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
