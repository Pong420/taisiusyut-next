import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BookModel } from '@/components/BookModel';
import { Skelecton } from '@/components/Skelecton';
import { BookShelf } from '@/hooks/useBookShelf';
import classes from './BookShelfItem.module.scss';

interface Props {
  book: BookShelf;
}

const bookModelWidth = 55;

export function BookShelfItem({ book: shelf }: Props) {
  const { query } = useRouter();
  const { book, lastVistChapter } = shelf;
  const { latestChapter } = book || {};

  const className = classes['item'];

  // disableSkelecton for value is empty
  const content = (flatten: boolean) => (
    <div className={classes['item-body']}>
      <BookModel width={bookModelWidth} flatten={flatten} />
      <div className={classes['item-content']}>
        <div className={classes['book-name']}>
          <Skelecton length={3}>{book?.name}</Skelecton>
        </div>
        <div className={classes['book-author']}>
          <Skelecton length={4}>{book?.author && `${book?.author} 著`}</Skelecton>
        </div>
        <div className={classes['book-latest-chapter']}>
          {latestChapter === '' ? null : <Skelecton length={5}>{latestChapter && `連載至 ${latestChapter}`}</Skelecton>}
        </div>
      </div>
    </div>
  );

  if (book) {
    const {} = {};
    const basePath = `/book/${book.provider}/${book.name}`;
    const href = typeof lastVistChapter === 'number' ? `${basePath}/${lastVistChapter}` : basePath;
    const active = !!book.name && query.provider === book.provider && query.bookName === book.name;
    return (
      <div className={[className, active ? classes['active'] : ''].join(' ').trim()}>
        <Link href={href} prefetch={false}>
          {/* Should not use <a /> since it have conflict with context menu in In iPhone safari */}
          {content(active)}
        </Link>
      </div>
    );
  }

  // TODO: book removed

  return <div className={className}>{content(false)}</div>;
}
