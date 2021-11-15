import React from 'react';
import { Header } from '@/components/Layout/Header';
import { ButtonPopover } from '@/components/ButtonPopover';
import { withMainMenuOverLay, MainMenuOverlayIcon } from '@/components/MainMenuOverlay';
import { useBookShelfState } from '@/hooks/useBookShelf';
import { useAuthState } from '@/hooks/useAuth';
import { BookShelfItem } from './BookShelfItem';
import { BookShelfEmpty } from './BookShelfEmpty';
import classes from './BookShelf.module.scss';

const MainMenuButton = withMainMenuOverLay(ButtonPopover);

export function BookShelf() {
  const shelf = useBookShelfState();
  const { loginStatus } = useAuthState();

  return (
    <>
      <Header className={classes['header']} title="書架" left={<MainMenuButton minimal icon={MainMenuOverlayIcon} />} />
      <div className={classes['border']}></div>
      {shelf.list.length ? (
        shelf.list.map(book => <BookShelfItem key={book.uid} book={book} />)
      ) : loginStatus === 'unknown' ? null : (
        <BookShelfEmpty />
      )}
    </>
  );
}
