import { Request } from 'express';
import { Controller, Get, NotFoundException, Req } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('chapter')
export class ChapterController {
  constructor(private readonly bookService: BookService) {}

  @Get('/:provider/:bookName')
  async getChapters(@Req() req: Request) {
    const { bookName, provider } = req.params;
    const book = await this.bookService.findByName(bookName, provider);
    if (!book) throw new NotFoundException();
    return book.chapters;
  }

  @Get('/:provider/:bookName/:chapterID')
  async getChapterContent(@Req() req: Request) {
    const { bookName, provider, chapterID } = req.params;
    return this.bookService.getChapterContent(bookName, provider, chapterID);
  }
}
