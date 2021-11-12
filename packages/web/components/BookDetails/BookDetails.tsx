import React from 'react';
import { Header, HeaderProps } from '@/components/Layout/Header';
import { BookInfoCard } from '@/components/BookInfoCard';
import { GoBackButton } from '@/components/GoBackButton';
import { BookShelfToggle } from '@/components/BookShelf/BookShelfToggle';
import { IBookDetails } from '@/typings';
import { BookDetailsChapters } from './BookDetailsChapters';
import classes from './BookDetails.module.scss';

export interface BookDetailsProps {
  book: IBookDetails;
}

const headerProps: HeaderProps = {
  title: '書籍詳情',
  left: <GoBackButton />
};

export function BookDetails({ book }: BookDetailsProps) {
  return (
    <>
      <Header
        {...headerProps}
        right={[<BookShelfToggle key="0" icon minimal bookID={book.bookID} provider={book.provider} />]}
      />
      <div className={classes['content']}>
        <BookInfoCard book={book} />
        <BookDetailsChapters chapters={book.chapters} />
      </div>
    </>
  );
}
