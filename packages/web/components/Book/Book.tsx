import React from 'react';
import { Header } from '@/components/Layout/Header';
import { IBook } from '@/typings';
import classes from './Book.module.scss';

export interface BookProps {
  book: IBook;
}

export function Book({ book }: BookProps) {
  return (
    <div className={classes['book']}>
      <Header></Header>
      <pre>{book.name}</pre>
      <pre>{book.author}</pre>
      <pre>{book.intro}</pre>
    </div>
  );
}
