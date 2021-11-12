import { Model } from 'mongoose';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose-crud.service';
import { IBookDetails } from '@/typings';
import { Book, BookDocument } from './schemas/book.schema';
import { getScraper } from './scraper/providers';

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

    try {
      const indexName = JSON.stringify(index).replace(/"|{|}/g, '').replace(/:|,/g, '_');
      await this.model.collection.dropIndex(indexName);
      await this.bookModel.collection.createIndex(index, { unique: true });
    } catch (error) {}
  }

  prune<T extends Partial<IBookDetails>>({ chapters, ...payload }: T) {
    return payload;
  }

  create(payload: Omit<IBookDetails, 'id'>) {
    return super.create(this.prune(payload));
  }

  async findByName(name: string, provider?: string): Promise<IBookDetails | null> {
    const scraper = getScraper(provider);

    if (scraper) {
      // TODO: memeroy cache ?
      const book = await this.findOne({ name, provider });

      if (book) {
        return scraper.getBook(book.bookID);
      }

      const results = await scraper.searchBooks(name);
      const result = results.find(b => b.name === name);

      if (result) {
        const payload = await scraper.getBook(result.bookID);
        await this.create(payload);
        return payload;
      }
    }

    return null;
  }

  async findOneAndUpsert(payload: Omit<IBookDetails, 'id'>) {
    return this.findOneAndUpdate({ bookID: payload.bookID, provider: payload.provider }, this.prune(payload), {
      upsert: true
    });
  }

  async getChapterContent(provider: string, bookName: string, chapterID: string) {
    const book = await this.findByName(bookName, provider);
    const scraper = getScraper(provider);
    if (book && scraper) {
      const content = await scraper.getChapterContent(book.bookID, chapterID);
      if (content) return content;
    }
    return null;
  }
}
