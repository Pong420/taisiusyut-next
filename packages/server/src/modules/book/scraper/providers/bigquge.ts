import path from 'path';
import chineseConv from 'chinese-conv';
import { CheerioAPI } from 'cheerio';
import { Injectable } from '@nestjs/common';
import { IBookDetails, ISearchResult, IChapter } from '@/typings';
import { Scraper } from '../scraper';
import { trimChapterName, trimChapterContent } from '../utils';

export const name = '筆趣閣';
const baseURL = 'http://www.b520.cc/';

@Injectable()
export class BiqugeScraper extends Scraper {
  constructor() {
    super(name, { baseURL });
  }

  protected _getChapters($: CheerioAPI) {
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

    return chapters;
  }

  async getBook(bookID: string) {
    const { data: $ } = await this.http.get('/' + bookID, {
      headers: {
        Referer: `${baseURL}/${bookID}/`
      }
    });
    const cover = $('#fmimg img').attr('src')?.replace('http://', 'https://');
    const name = $('#info h1').text();
    const author = $('#info p:nth-child(2)').text().split('：')[1];

    const description = $('#intro p').html()?.trim().replace(/<br>/g, '\n') || '';

    const chapters = this._getChapters($);
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

  async getChapters(bookID: string) {
    const { data } = await this.http.get('/' + bookID);
    return this._getChapters(data);
  }

  async getChapterContent(bookID: string, chapterID: string) {
    const { data: $ } = await this.http.get(`/${bookID}/${chapterID}.html`, {
      headers: {
        Referer: `${baseURL}/${bookID}/`
      }
    });

    const [prevChapter, , nextChapter] = $('.bottem1 a')
      .toArray()
      .slice(1, 4)
      .map(el => {
        const id = path.basename($(el).attr('href') || '').replace('.html', '');
        return id === bookID ? null : id;
      });

    const [bookName, fullChapterName] =
      $("meta[name='keywords']")
        .attr('content')
        ?.split(',')
        .map(str => str.replace(/ /g, '')) || [];

    const chapterName = trimChapterName(fullChapterName);

    const paragraph = trimChapterContent($('#content').text().trim(), { bookName, fullChapterName });

    return {
      name: chapterName,
      nextChapter,
      prevChapter,
      paragraph
    };
  }

  async searchBooks(name: string) {
    const { data: $ } = await this.http.get('/modules/article/search.php', {
      params: {
        searchkey: chineseConv.sify(name)
      },
      headers: {
        Referer: baseURL
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
