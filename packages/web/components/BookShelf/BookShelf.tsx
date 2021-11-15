import React from 'react';
import { Header } from '@/components/Layout/Header';
import { MainMenuButton } from '@/components/MainMenuOverlay';
import { useBookShelfState } from '@/hooks/useBookShelf';
import { useAuthState } from '@/hooks/useAuth';
import { BookShelfItem } from './BookShelfItem';
import { BookShelfEmpty } from './BookShelfEmpty';
import classes from './BookShelf.module.scss';

export function BookShelf() {
  const shelf = useBookShelfState();
  const { loginStatus } = useAuthState();

  return (
    <>
      <Header className={classes['header']} title="書架" left={<MainMenuButton />} />
      <div className={classes['shelf']}>
        {shelf.list.length ? (
          shelf.list.map(book => <BookShelfItem key={book.uid} book={book} />)
        ) : loginStatus === 'unknown' ? null : (
          <BookShelfEmpty />
        )}
      </div>
    </>
  );
}
