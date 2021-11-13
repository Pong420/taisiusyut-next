import { GetServerSideProps } from 'next';
import { BookDetails, BookDetailsProps } from '@/components/BookDetails';
import { getBookService } from '@taisiusyut-next/server';

export const getServerSideProps: GetServerSideProps<BookDetailsProps> = async context => {
  const { bookName, provider } = context.query;
  const service = await getBookService();
  if (typeof bookName === 'string' && typeof provider === 'string') {
    const book = await service.findByName({ bookName, provider });
    if (book) {
      return { props: { book } };
    }
  }
  return { notFound: true };
};

export default function BookDetailPage(props: BookDetailsProps) {
  return <BookDetails {...props} />;
}
