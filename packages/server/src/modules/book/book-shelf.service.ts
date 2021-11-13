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

    try {
      const indexName = JSON.stringify(index).replace(/"|{|}/g, '').replace(/:|,/g, '_');
      await this.bookShelfModel.collection.dropIndex(indexName);
    } catch (error) {}

    await this.bookShelfModel.collection.createIndex(index, { unique: true });
  }
}
