import { GetServerSideProps } from 'next';
import { Book, BookProps } from '@/components/Book';
import { getScraper } from '@taisiusyut-next/server';

export const getServerSideProps: GetServerSideProps<BookProps> = async context => {
  // const { bookName, provider } = context.query;
  // if (typeof bookName === 'string' && typeof provider === 'string') {
  //   const scraper = getScraper(provider);
  //   if (scraper) {
  //     const book = await scraper.getBook();
  //   }
  // }
  return { notFound: true };
};

export default function BookPage(props: BookProps) {
  return <Book {...props} />;
}
