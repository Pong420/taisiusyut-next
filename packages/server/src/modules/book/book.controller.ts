import { Request } from 'express';
import { Body, Controller, Delete, Get, NotFoundException, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '@/modules/users/users.service';
import { getScraper } from './scraper/providers';
import { BookPayloadDto } from './dto';
import { BookService } from './book.service';
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService, private readonly userService: UsersService) {}

  @Get('/shelf')
  @UseGuards(AuthGuard('jwt'))
  async shelf(@Req() req: Request) {
    const user = await this.userService.findOne({ id: req.user?.id });
    return user ? this.bookService.find({ _id: { $in: user.books } }) : [];
  }

  @Get('/:provider?')
  search(@Req() req: Request) {
    const q = req.query.q;
    const scraper = getScraper(req.params.provider);

    if (typeof q === 'string' && scraper) {
      return scraper.searchBooks(q);
    }

    throw new NotFoundException();
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  async add(@Req() req: Request, @Body() payload: BookPayloadDto) {
    const { bookID, provider } = payload;
    const scraper = getScraper(provider);
    if (scraper) {
      const update = await scraper.getBook(payload.bookID);
      const book = await this.bookService.findOneAndUpdate({ bookID }, update, { upsert: true });
      if (book) {
        await this.userService.updateOne({ id: req.user?.id }, { $push: { books: book.id } });
        return book;
      }
    }

    throw new NotFoundException();
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Req() req: Request) {
    await this.userService.updateOne({ id: req.user?.id }, { $pull: { books: req.params.id } });
    return { message: 'success' };
  }
}
