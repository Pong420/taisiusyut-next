import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose-crud.service';
import { Book, BookDocument } from './schemas/book.schema';

@Injectable()
export class BookService extends MongooseCRUDService<Book> {
  constructor(@InjectModel(Book.name) model: Model<BookDocument>) {
    super(model);
  }
}
