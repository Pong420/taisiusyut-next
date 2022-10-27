import * as cheerio from 'cheerio';
import { Provider, IChapterItem, BookInfo, ChapterContent } from './_provider';
import { encodeGBK, gbkContentToUFT8, traditionalization, translate } from '../utils/transformer';

export * from './_provider';

export default class BookProvider extends Provider {
  static id = 'xbiquge.so' as const;

  constructor() {
    super({
      api: {
        baseURL: `https://www.xbiquge.so`,
        responseType: 'arraybuffer',
        transformResponse: [gbkContentToUFT8, traditionalization]
      }
    });
  }

  parseBook(html: string) {
    const $ = cheerio.load(html);

    const id = $('meta[property="og:url"]').attr('content')?.split('/').slice(-2)[0];
    const name = $('meta[property="og:novel:book_name"]').attr('content');
    const category = $('meta[property="og:novel:category"]').attr('content');
    const author = $('meta[property="og:novel:author"]').attr('content');
    const description = $('#intro')
      .text()
      .trim()
      .replace(/^[\s]+/gm, '');
    const status = $('meta[property="og:novel:status"]').attr('content');
    const latest = $('meta[property="og:novel:latest_chapter_name"]').attr('content');
    const lastUpdate = $('meta[property="og:novel:update_time"]').attr('content');
    const cover = $('meta[property="og:image"]').attr('content');

    const chapters = $('center.clear ~ dd')
      .toArray()
      .reduce((chapters, node) => {
        const $a = $(node).find('a');
        const id = $a.attr('href')?.replace('.html', '');
        const name = $a.text();
        return id && name ? [...chapters, { id, name }] : chapters;
      }, [] as IChapterItem[]);

    const results = BookInfo.safeParse({
      id,
      name,
      author,
      category,
      description,
      status,
      latest,
      lastUpdate,
      cover,
      chapters
    });

    if (results.success) {
      return results.data;
    }

    throw results.error;
  }

  parseContent(html: string) {
    const $ = cheerio.load(html);
    const name = $('.bookname h1').text();
    const content = $('#content')
      .html()
      ?.trim()
      .replace(/(<br>)+/g, '\n')
      .replace(/^[\s|&nbsp;]+/gm, '');
    const [, $prev, , $next] = $('.bottem a').toArray();

    const getChaterId = (el?: cheerio.Element) => el?.attribs['href']?.match(/(\d+)\.html$/)?.[1];

    const results = ChapterContent.safeParse({
      name,
      content,
      prev: getChaterId($prev),
      next: getChaterId($next)
    });

    if (results.success) {
      return results.data;
    }

    throw results.error;
  }

  async search(searchKey: string) {
    searchKey = translate.t2s(searchKey);
    searchKey = encodeGBK(searchKey);
    const pathname = `/modules/article/search.php?searchkey=${searchKey}`;
    const resp = await this.api.get<string>(pathname);

    try {
      const { chapters, ...book } = this.parseBook(resp.data);
      return [book];
    } catch (error) {
      return [];
    }
  }

  async getBook(id: string) {
    const pathname = `/book/${id}/`;
    const resp = await this.api.get<string>(pathname);
    return this.parseBook(resp.data);
  }

  async getChapters(id: string) {
    const { chapters } = await this.getBook(id);
    return chapters;
  }

  async getChapterContent(bookId: string, chapterId: string) {
    const pathname = `/book/${bookId}/${chapterId}.html`;
    const resp = await this.api.get<string>(pathname);
    return this.parseContent(resp.data);
  }
}
