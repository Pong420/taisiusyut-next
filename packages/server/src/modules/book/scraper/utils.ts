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
      .replace(new RegExp(`[\(|（].*[${cnNum.join('|')}|0-9|加]更[\)|）]$`, 'g'), '')
      .replace(new RegExp(`[\(|（](.*月票.*)[\)|）]$`, 'g'), '')
      .replace(new RegExp(`[\(|（](.*盟.*)[\)|）]$`, 'g'), '')
      .replace(/^[0-9]+/, '')
      .trim()
      .replace(/ 新$/, '') || name
  );
}
