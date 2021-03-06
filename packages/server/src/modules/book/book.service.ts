import { Model } from 'mongoose';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose-crud.service';
import { IBookDetails } from '@/typings';
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

    await this.model.collection.createIndexes([{ key: index, unique: true }]);
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
      const book = await this.findOne({ name: bookName, provider });

      if (book) {
        return scraper.getBook(book.bookID);
      }

      const results = await scraper.searchBooks(bookName);
      const result = results.find(b => b.name === bookName) || results[0];

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

  async getChapterContent({ provider, bookName, chapterNo }: GetChapterContentDto) {
    const book = await this.findByName({ bookName, provider });
    const scraper = getScraper(provider);

    if (book && scraper) {
      const chapter = book.chapters
        .slice(Math.max(0, chapterNo - 10), chapterNo + 10)
        .find(chapter => chapterNo === chapter.no);

      if (chapter) {
        const content = await scraper.getChapterContent(book.bookID, chapter.id);
        if (content) return { chapter: content, chapters: book.chapters };
      }
    }
    return null;
  }
}
