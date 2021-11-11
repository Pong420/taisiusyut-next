import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book, BookSchema } from './schemas/book.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Book.name,
        useFactory: async () => {
          return BookSchema;
        }
      }
    ])
  ],
  controllers: [BookController],
  providers: [BookService]
})
export class BookModule {}
