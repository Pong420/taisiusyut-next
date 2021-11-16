import { Model } from 'mongoose';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose-crud.service';
import { BookShelf, BookShelfDocument } from './schemas/book-shelf.schema';

@Injectable()
export class BookShelfService extends MongooseCRUDService<BookShelf> implements OnModuleInit {
  constructor(@InjectModel(BookShelf.name) protected readonly bookShelfModel: Model<BookShelfDocument>) {
    super(bookShelfModel);
  }

  async onModuleInit() {
    const index: { [X in keyof BookShelf]?: any } = {
      book: 1,
      user: 1
    };

    await this.model.collection.createIndexes([{ key: index, unique: true }]);
  }
}
