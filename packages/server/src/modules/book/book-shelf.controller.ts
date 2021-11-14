import { Request } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getScraper } from './scraper/providers';
import { BookPayloadDto, UpdateBookShelfDto } from './dto';
import { BookService } from './book.service';
import { BookShelfService } from './book-shelf.service';

@Controller('/shelf')
export class BookShelfController {
  constructor(private readonly bookService: BookService, private readonly bookShelfService: BookShelfService) {}

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  async shelf(@Req() req: Request) {
    return this.bookShelfService.find({ user: req.user?.id }, {}, { populate: 'book' });
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  async add(@Req() req: Request, @Body() payload: BookPayloadDto) {
    const scraper = getScraper(payload.provider);
    if (scraper) {
      const details = await scraper.getBook(payload.bookID);
      const book = await this.bookService.findOneAndUpsert(details);
      if (book) {
        const shelf = await this.bookShelfService.create({ book: book.id, user: req.user?.id });
        shelf.book = book;
        return shelf;
      }
    }
    throw new NotFoundException();
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Req() req: Request) {
    try {
      await this.bookShelfService.delete({ _id: req.params.id });
      return { message: 'success' };
    } catch (error) {
      throw new InternalServerErrorException();
    }

    // try {
    //   const shelf = await this.bookShelfService.findOne({ _id: req.params.id }, { populate: 'book' });
    //   if (shelf) {
    //     await this.bookShelfService.delete({ _id: req.params.id });
    //     return shelf;
    //   }
    //   throw new NotFoundException();
    // } catch (error) {
    //   throw new InternalServerErrorException();
    // }
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() payload: UpdateBookShelfDto) {
    const result = await this.bookShelfService.updateOne({ _id: id }, payload);
    if (result.modifiedCount) {
      return { message: 'success' };
    }
    throw new InternalServerErrorException();
  }
}
