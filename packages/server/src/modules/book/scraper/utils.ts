import * as cheerio from 'cheerio';
import { AxiosResponseTransformer } from 'axios';
import iconv from 'iconv';
import chineseConv from 'chinese-conv';

export const transformResponse: AxiosResponseTransformer = (data: Buffer, responseHeader = {}) => {
  const matches = responseHeader?.['content-type']?.match(/charset=([^&| |;]+)/g);
  const encoding = matches ? matches[0].split('=')[1].toUpperCase() : 'UTF-8';

  const converter = new iconv.Iconv(encoding, 'UTF-8//TRANSLIT//IGNORE');

  let html: string = converter.convert(data).toString();
  html = chineseConv.tify(html);

  return cheerio.load(html, { decodeEntities: false });
};

export function trimChapterName(name: string) {
  const cnNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '〇'];

  return (
    name
      .replace(new RegExp(`^第.*[${cnNum.join('|')}|0-9][章|篇| ][：|、|?]?|[0-9]*、`, 'g'), '')
      .replace(new RegExp(`[\(|（｜【].*[${cnNum.join('|')}|0-9|加]更[\)|）｜】]$`, 'g'), '')
      .replace(new RegExp(`[\(|（｜【](.*月票.*)[\)|）】]$`, 'g'), '')
      .replace(new RegExp(`[\(|（｜【](.*盟.*)[\)|）｜】]$`, 'g'), '')
      .replace(/^[0-9]+/, '')
      .trim()
      .replace(/ 新$/, '') || name
  );
}

export function escapeRegex(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export const invalidRegex = /[°"§%()[\]{}=\\?´`'#<>|,;.:+_-]+/g;

export function trimChapterContent(content: string, { bookName = '', fullChapterName = '' }) {
  return content
    .replace(/\s\s\s/g, '\n')
    .replace(/\s\s/g, '\n')
    .replace(/\s/g, '\n')
    .replace(/((\/?)>|&#|：。：|\.。m\.|bq|&n|「」|bsp;|『……)|www./g, '')
    .replace(/(http[s]?):\/\/(\w+:{0,1}\w*@)?(\S+)?(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/g, '')
    .replace(/\/book_*/g, '')
    .replace(/(『點擊章節報錯』|『加入書簽，方便閱讀』|熱門推薦：)/g, '')
    .replace(/(天才本站|天才一秒).*/gm, '')
    .replace(/\/最快更新！無廣告！/g, '')
    .replace(/天才壹秒記住.*.為您提供精彩小說閱讀。/g, '')
    .replace(/手機用戶請瀏覽.*.更優質的閱讀體驗。/g, '')
    .replace(/^.*(手機版(閱讀)?網址).*$/gm, '')
    .replace(/佰度搜索.*.閱讀網址：/g, '')
    .replace(/--上拉加載下一章.*.[\n]?/g, '')
    .replace(new RegExp(`小說網..org，`, 'g'), '')
    .replace(new RegExp(`最快更新${escapeRegex(bookName.replace(invalidRegex, ''))}最新章節！`, 'g'), '')
    .replace(new RegExp(`${escapeRegex(bookName.replace(invalidRegex, ''))}正文(卷|正文)?`, 'g'), '')
    .replace(new RegExp(`^${escapeRegex(bookName)}.*.${escapeRegex(fullChapterName)}`, 'g'), '')
    .replace(new RegExp(`^${escapeRegex(bookName)}`, 'gm'), '')
    .replace(new RegExp(escapeRegex(fullChapterName), 'g'), '')
    .replace(/-+這是華麗的分割線(.*?)這是華麗的分割線-*/gs, '')
    .replace(/\s\s+/g, '\n')
    .replace(/\n.*.閱讀(地|網)址(：|:)/g, '')
    .replace(/(\n?).*.guoertejia.*/, '')
    .replace(/收藏*本站/g, '')
    .replace(/.{1}菠(.)蘿(.*)小(.*)說/, '')
    .replace(/最快更新，無彈窗閱讀請。/, '')
    .replace(/第.*[零|一|二|三|四|五|六|七|八|九|十|百|千|0-9|〇][章|篇][：|、]?|[0-9]*、/g, '')
    .replace(/APPapp/g, '')
    .replace(/\/?p(>|&gt;)|nt|\/p/g, '')
    .replace(/狂沙文學網/g, '')
    .replace(/^.{1}悠閱書城.*/gm, '')
    .replace(/((厺厽)+|攫+|欝+|(巘戅)+)(.+。)?/gm, '')
    .replace(/戅+/gm, '')
    .replace(/(笔趣阁|追书看|九饼中文|综艺文学|云轩阁|笔下文学|suYinGt)/g, '')
    .replace(/(LOL|頂點)小說網/g, '')
    .replace(/^.*((小说|品书|书仓|奇書|奇书|妙书)(苑|网|網))$/gm, '')
    .replace(/^.*\.(com|net|org|cc|co)$/gim, '')
    .replace(/^。/gm, '')
    .trim()
    .split('\n')
    .filter(str => !/^(。|.)$/.test(str));
}
