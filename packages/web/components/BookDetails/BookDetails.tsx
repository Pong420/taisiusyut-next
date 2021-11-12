import React from 'react';
import { Header, HeaderProps } from '@/components/Layout/Header';
import { BookInfoCard } from '@/components/BookInfoCard';
import { GoBackButton } from '@/components/GoBackButton';
import { IBook } from '@/typings';
import classes from './BookDetails.module.scss';

export interface BookDetailsProps {
  book: IBook;
}

const headerProps: HeaderProps = {
  title: '書籍詳情',
  left: <GoBackButton />
};

export function BookDetails({ book }: BookDetailsProps) {
  return (
    <div className={classes['book']}>
      <Header {...headerProps}></Header>
      <div style={{ padding: 15 }}>
        <BookInfoCard book={book} className={classes['info']} />
      </div>
    </div>
  );
}
