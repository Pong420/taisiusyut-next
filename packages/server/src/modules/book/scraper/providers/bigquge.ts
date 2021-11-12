import path from 'path';
import chineseConv from 'chinese-conv';
import { Injectable } from '@nestjs/common';
import { IBookDetails, ISearchResult, IChapter } from '@/typings';
import { Scraper } from '../scraper';
import { trimChapterName } from '../utils';

export const name = '筆趣閣';

@Injectable()
export class BiqugeScraper extends Scraper {
  constructor() {
    super(name, { baseURL: 'https://www.biquge5200.cc/' });
  }

  async getBook(bookID: string) {
    const { data: $ } = await this.http.get('/' + bookID);
    const cover = $('#fmimg img').attr('src')?.replace('http://', 'https://');
    const name = $('#info h1').text();
    const author = $('#info p:nth-child(2)').text().split('：')[1];

    const description = $('#intro p').html()?.trim().replace(/<br>/g, '\n') || '';

    const $chapters = $('#list dl').children();
    const flag = $('#list dt').last().index();

    const chapters: IChapter[] = [];
    let chapterNo = 1;

    $chapters.each((index, el) => {
      if (index > flag) {
        const $aTag = $(el).find('a');
        const originName = $aTag.text()?.trim();
        const name = trimChapterName(originName);
        const id = $aTag.attr('href');
        if (id) {
          chapters.push({ no: chapterNo, id: path.basename(id).replace(/\.html/, ''), name });
          chapterNo++;
        }
      }
    });

    const [{ name: latestChapter }] = chapters.slice(-1);

    const book: Omit<IBookDetails, 'id'> = {
      provider: this.name,
      bookID,
      name,
      author,
      cover,
      chapters,
      description,
      latestChapter
    };

    return book;
  }

  async searchBooks(name: string) {
    const { data: $ } = await this.http.get('/modules/article/search.php', {
      params: {
        searchkey: chineseConv.sify(name)
      }
    });

    return $('.grid tr:nth-child(n+2)')
      .toArray()
      .reduce((result, row) => {
        const $col = $($(row).children());
        const text = (nth: number) => $($col[nth]).text().trim();

        const name = text(0);
        const bookID =
          $($col[0])
            .find('a')
            ?.attr('href')
            ?.replace(/.*\/(?=[^/].*$)|\//g, '') || '';

        if (bookID) {
          const latestChapter = text(1);
          const author = text(2);
          const updateTime = text(4);
          const status = text(5)
            .replace(/連載$/i, '連載中')
            .replace(/已經完本$/i, '完本');

          result.push({
            name,
            bookID,
            status,
            author,
            latestChapter: trimChapterName(latestChapter),
            updatedAt: new Date(updateTime).getTime(),
            provider: this.name
          });
        }
        return result;
      }, [] as ISearchResult[]);
  }
}
