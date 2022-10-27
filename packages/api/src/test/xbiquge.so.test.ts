import fs from 'fs/promises';
import path from 'path';
import MockAdapter from 'axios-mock-adapter';
import { expect, test } from '@jest/globals';
import Provider, { BookInfo } from '../provider/xbiquge.so';

const provider = new Provider();
const mock = new MockAdapter(provider.api);
const getMockHTML = (pathname: string) => fs.readFile(path.join(__dirname, 'mock', 'xbiquge.so', pathname));

mock.onGet(new RegExp(`/modules/article/search.php`)).reply(async () => {
  const buffer = await getMockHTML('book.html');
  return [200, buffer];
});

mock.onGet(/\/book\/\d+\/$/).reply(async () => {
  const buffer = await getMockHTML('book.html');
  return [200, buffer];
});

mock.onGet(/\/book\/\d+\/\d+\.html$/).reply(async () => {
  const buffer = await getMockHTML('content.html');
  return [200, buffer];
});

test('search book', async () => {
  await expect(provider.search('')).resolves.not.toThrowError();
});

test('get book', async () => {
  await expect(provider.getBook('43106')).resolves.not.toThrowError();
});

test('get chapters', async () => {
  await expect(provider.getChapters('43106')).resolves.not.toThrowError();
});

test('get chapter content', async () => {
  await expect(provider.getChapterContent('43106', '37043922')).resolves.not.toThrowError();
});
