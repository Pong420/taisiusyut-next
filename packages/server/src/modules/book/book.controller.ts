import { Request } from 'express';
import {
  CacheInterceptor,
  Controller,
  Get,
  Logger,
  MethodNotAllowedException,
  NotFoundException,
  Req,
  UseInterceptors
} from '@nestjs/common';
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

  @Get('/:provider/:bookID')
  async getBook(@Req() req: Request) {
    if (process.env.NODE_ENV === 'production') {
      throw new MethodNotAllowedException();
    }

    Logger.debug(`Getting book ${req.params.bookID}`);

    const scraper = getScraper(req.params.provider);

    if (scraper) {
      const result = await scraper.getBook(req.params.bookID);
      return result;
    }

    throw new NotFoundException();
  }

  @Get('/:provider/:bookID/:chapterID')
  async getChapterContent(@Req() req: Request) {
    if (process.env.NODE_ENV === 'production') {
      throw new MethodNotAllowedException();
    }

    Logger.debug(`Getting chapter content ${req.params.bookID} ${req.params.chapterID}`);

    const scraper = getScraper(req.params.provider);

    if (scraper) {
      const result = await scraper.getChapterContent(req.params.bookID, req.params.chapterID);
      return result;
    }

    throw new NotFoundException();
  }
}
