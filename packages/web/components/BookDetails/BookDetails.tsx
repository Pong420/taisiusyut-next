import React from 'react';
import { Header, HeaderProps } from '@/components/Layout/Header';
import { BookInfoCard } from '@/components/BookInfoCard';
import { GoBackButton } from '@/components/GoBackButton';
import { BookShelfToggle } from '@/components/BookShelf/BookShelfToggle';
import { IBookDetails } from '@/typings';
import { BookDetailsChapters } from './BookDetailsChapters';
import classes from './BookDetails.module.scss';
import { Meta } from '../Meta';

export interface BookDetailsProps {
  book: IBookDetails;
}

const headerProps: HeaderProps = {
  title: '書籍詳情',
  left: <GoBackButton targetPath={['/', '/search']} />
};

export function BookDetails({ book }: BookDetailsProps) {
  return (
    <>
      <Meta title={`${book.name} | 睇小說`} />
      <Header
        {...headerProps}
        right={[<BookShelfToggle key="0" icon minimal bookID={book.bookID} provider={book.provider} />]}
      />
      <div className={classes['content']}>
        <BookInfoCard book={book} />
        <BookDetailsChapters bookName={book.name} provider={book.provider} chapters={book.chapters} />
      </div>
    </>
  );
}
