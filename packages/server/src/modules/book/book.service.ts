import { Model } from 'mongoose';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose-crud.service';
import { Book, BookDocument } from './schemas/book.schema';

@Injectable()
export class BookService extends MongooseCRUDService<Book> implements OnModuleInit {
  constructor(@InjectModel(Book.name) protected readonly bookModel: Model<BookDocument>) {
    super(bookModel);
  }

  async onModuleInit() {
    const index: { [X in keyof Book]?: any } = {
      bookID: 1,
      provider: 1
    };
    await this.bookModel.collection.createIndex(index, { unique: true });
  }
}
