import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose-crud.service';
import { BookShelf, BookShelfDocument } from './schemas/book-shelf.schema';

@Injectable()
export class BookShelfService extends MongooseCRUDService<BookShelf> {
  constructor(@InjectModel(BookShelf.name) protected readonly bookShelfModel: Model<BookShelfDocument>) {
    super(bookShelfModel);
  }
}
