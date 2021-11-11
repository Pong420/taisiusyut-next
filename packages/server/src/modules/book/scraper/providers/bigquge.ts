import chineseConv from 'chinese-conv';
import { Injectable } from '@nestjs/common';
import { ISearchResult } from '@/typings';
import { Scraper, trimChapterName } from '..';

export const name = 'bigquge';

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
    const intro = $('#intro p').html()?.trim().replace(/<br>/g, '\n') || '';
    const [chapter] = $('#list dl').children().toArray().slice(-1);
    const $aTag = $(chapter).find('a');
    const chapterName = $aTag.text()?.trim();
    const latestChapter = trimChapterName(chapterName);

    return {
      bookID,
      name,
      author,
      cover,
      intro,
      latestChapter
    };
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
            updatedAt: new Date(updateTime).getTime()
          });
        }
        return result;
      }, [] as ISearchResult[]);
  }
}
