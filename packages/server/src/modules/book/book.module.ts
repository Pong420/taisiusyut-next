import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@/modules/users/users.module';
import { BookController } from './book.controller';
import { ChapterController } from './chapter.controller';
import { BookService } from './book.service';
import { Book, BookSchema } from './schemas/book.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeatureAsync([
      {
        name: Book.name,
        useFactory: async () => {
          return BookSchema;
        }
      }
    ])
  ],
  controllers: [BookController, ChapterController],
  providers: [BookService]
})
export class BookModule {}
