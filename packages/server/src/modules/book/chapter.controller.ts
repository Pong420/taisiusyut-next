import { Controller, Get, NotFoundException, Param, UseInterceptors, CacheInterceptor, Logger } from '@nestjs/common';
import { BookService } from './book.service';
import { GetChapterContentDto, GetChaptersDto } from './dto';

@Controller('chapter')
@UseInterceptors(CacheInterceptor)
export class ChapterController {
  constructor(private readonly bookService: BookService) {}

  @Get('/:provider/:bookName')
  async getChapters(@Param() { bookName, provider }: GetChaptersDto) {
    Logger.debug(`Searching for ${bookName}`);

    const book = await this.bookService.findByName({ bookName, provider });

    Logger.debug(`Found ${book?.chapters.length} chapters`);

    if (!book) throw new NotFoundException();
    return book.chapters;
  }

  @Get('/:provider/:bookName/:chapterNo')
  async getChapterContent(@Param() payload: GetChapterContentDto) {
    Logger.debug(`Searching for ${payload.bookName} chapter ${payload.chapterNo}`);

    const result = await this.bookService.getChapterContent(payload);

    Logger.debug(`Found ${result?.chapter.paragraph.length} characters`);

    if (!result) {
      throw new NotFoundException();
    }

    return result.chapter;
  }
}
