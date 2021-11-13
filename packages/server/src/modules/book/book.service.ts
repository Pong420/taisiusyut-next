import { Model } from 'mongoose';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose-crud.service';
import { IBookDetails, IChapterContent } from '@/typings';
import { Book, BookDocument } from './schemas/book.schema';
import { getScraper } from './scraper/providers';
import { GetChapterContentDto } from './dto';

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

  async findByName({ bookName, provider }: { bookName: string; provider?: string }): Promise<IBookDetails | null> {
    const scraper = getScraper(provider);

    if (scraper) {
      // TODO: memeroy cache ?
      const book = await this.findOne({ bookName, provider });

      if (book) {
        return scraper.getBook(book.bookID);
      }

      const results = await scraper.searchBooks(bookName);
      const result = results.find(b => b.name === bookName);

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

  async getChapterContent({ provider, bookName, chapterNo }: GetChapterContentDto): Promise<IChapterContent | null> {
    const book = await this.findByName({ bookName, provider });
    const scraper = getScraper(provider);

    if (book && scraper) {
      const chapter = book.chapters
        .slice(Math.max(0, chapterNo - 10), chapterNo + 10)
        .find(chapter => chapterNo === chapter.no);

      if (chapter) {
        const content = await scraper.getChapterContent(book.bookID, chapter.id);
        if (content) return content;
      }
    }
    return null;
  }
}
