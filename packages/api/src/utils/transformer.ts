import iconv from 'iconv-lite';
import { load as cheerioLoad } from 'cheerio';
import { tify, sify } from 'chinese-conv';
import { AxiosResponseTransformer } from 'axios';

export type { CheerioAPI } from 'cheerio';

export const translate = {
  s2t: tify,
  t2s: sify
};

export const gbkContentToUFT8: AxiosResponseTransformer = (data, responseHeader) => {
  const matches = responseHeader['content-type']?.match(/charset=([^&| |;]+)/g);
  const encoding = matches?.[0]?.split('=')[1]?.toLowerCase() || 'utf-8';
  return iconv.decode(data, encoding);
};

export const traditionalization: AxiosResponseTransformer = (data: Buffer | string) => {
  return translate.s2t(data instanceof Buffer ? data.toString() : data);
};

export const htmlToCheerIO: AxiosResponseTransformer = (html: string) => {
  return cheerioLoad(html, { decodeEntities: false });
};

export const encodeGBK = (value: string) =>
  iconv
    .encode(value, 'gbk')
    .toString('hex')
    .replace(/([\w\d]{2})/g, s => `%${s.toUpperCase()}`);
