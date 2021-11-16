import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookController } from './book.controller';
import { BookShelfController } from './book-shelf.controller';
import { ChapterController } from './chapter.controller';
import { BookService } from './book.service';
import { BookShelfService } from './book-shelf.service';
import { Book, BookSchema } from './schemas/book.schema';
import { BookShelf, BookShelfSchema } from './schemas/book-shelf.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Book.name,
        schema: BookSchema
      },
      {
        name: BookShelf.name,
        schema: BookShelfSchema
      }
    ])
  ],
  controllers: [BookController, ChapterController, BookShelfController],
  providers: [BookService, BookShelfService, Logger]
})
export class BookModule {}
