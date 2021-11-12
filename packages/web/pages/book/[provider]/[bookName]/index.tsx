import { GetServerSideProps } from 'next';
import { BookDetails, BookDetailsProps } from '@/components/BookDetails';
import { getBookService, getSerializer } from '@taisiusyut-next/server';
import { IBook } from '@/typings';

export const getServerSideProps: GetServerSideProps<BookDetailsProps> = async context => {
  const { bookName, provider } = context.query;
  const [service, serializer] = await Promise.all([getBookService(), getSerializer()]);
  if (typeof bookName === 'string' && typeof provider === 'string') {
    const doc = await service.findByName(bookName, provider);
    if (doc) {
      return { props: { book: serializer.transformToPlain(doc, {}) as IBook } };
    }
  }
  return { notFound: true };
};

export default function BookPage(props: BookDetailsProps) {
  return <BookDetails {...props} />;
}
