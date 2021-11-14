import { Controller, Get, NotFoundException, Param, UseInterceptors, CacheInterceptor } from '@nestjs/common';
import { BookService } from './book.service';
import { GetChapterContentDto, GetChaptersDto } from './dto';

@Controller('chapter')
@UseInterceptors(CacheInterceptor)
export class ChapterController {
  constructor(private readonly bookService: BookService) {}

  @Get('/:provider/:bookName')
  async getChapters(@Param() { bookName, provider }: GetChaptersDto) {
    const book = await this.bookService.findByName({ bookName, provider });
    if (!book) throw new NotFoundException();
    return book.chapters;
  }

  @Get('/:provider/:bookName/:chapterNo')
  async getChapterContent(@Param() payload: GetChapterContentDto) {
    const result = await this.bookService.getChapterContent(payload);

    if (!result) {
      throw new NotFoundException();
    }

    return result.chapter;
  }
}
