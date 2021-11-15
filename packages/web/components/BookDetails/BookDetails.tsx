import React from 'react';
import Link from 'next/link';
import { Button } from '@blueprintjs/core';
import { Header, HeaderProps } from '@/components/Layout/Header';
import { Meta } from '@/components/Meta';
import { BookInfoCard } from '@/components/BookInfoCard';
import { GoBackButton } from '@/components/GoBackButton';
import { useChapterListDrawer } from '@/components/ChapterListDrawer';
import { BookShelfToggle } from '@/components/BookShelf/BookShelfToggle';
import { useBookShelfState, bookShelfUid } from '@/hooks/useBookShelf';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { IBookDetails } from '@/typings';
import { BookDetailsChapters } from './BookDetailsChapters';
import { ChapterListDrawerCard } from './ChapterListDrawerCard';
import classes from './BookDetails.module.scss';

export interface BookDetailsProps {
  book: IBookDetails;
}

const headerProps: HeaderProps = {
  title: '書籍詳情',
  left: <GoBackButton targetPath={['/', '/search']} />
};

export function BookDetails({ book }: BookDetailsProps) {
  const state = useBookShelfState();
  const shelf = state.byIds[bookShelfUid(book)];
  const lastVistChapter = shelf?.lastVistChapter;

  const { provider, name } = book;

  const [openChapterListDrawer, chapters] = useChapterListDrawer(
    { provider, bookName: name, chapterNo: lastVistChapter },
    book.chapters
  );

  const [breakPoint, mouted] = useBreakPoints();

  return (
    <>
      <Meta title={`${book.name} | 睇小說`} />
      <Header
        {...headerProps}
        position="right"
        right={[
          <BookShelfToggle key="0" icon minimal bookID={book.bookID} provider={book.provider} bookName={book.name} />
        ]}
      />
      <div className={classes['content']}>
        <BookInfoCard book={book} />
        <BookDetailsChapters bookName={book.name} provider={book.provider} chapters={chapters} />

        {mouted && breakPoint <= 768 && (
          <div className={classes['bottom']}>
            <ChapterListDrawerCard onClick={openChapterListDrawer} />
            <div className={classes['button-group']}>
              <Link href={`/book/${provider}/${name}/${lastVistChapter}`} passHref>
                <Button fill intent="primary" text={lastVistChapter === 1 ? '開始閱讀' : '繼續閱讀'} />
              </Link>
              <BookShelfToggle fill provider={provider} bookName={name} bookID={book.bookID} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
