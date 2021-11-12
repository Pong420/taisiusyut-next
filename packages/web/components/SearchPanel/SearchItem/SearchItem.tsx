import React from 'react';
import Link from 'next/link';
import { Tag } from '@blueprintjs/core';
import { useRouter } from 'next/router';
import { Skelecton } from '@/components/Skelecton';
import { dayjs } from '@/utils/dayjs';
import { ISearchResult } from '@/typings';
import classes from './SearchItem.module.scss';

interface Props {
  book: Partial<ISearchResult>;
}

const className = classes['item'];

export function SearchItem({ book }: Props) {
  const { asPath } = useRouter();

  const content = () => (
    <div className={classes['item-body']}>
      {/* <BookModel width={55} flatten={flatten} className={classes['book-model']} /> */}
      <div className={classes['item-content']}>
        <div className={classes['book-name']}>
          <Skelecton length={3}>{book?.name}</Skelecton>
        </div>
        <div className={classes['book-author']}>
          <Skelecton length={3}>{book?.author && `${book.author} 著`}</Skelecton>
        </div>

        <div className={classes['book-updated-at']}>
          <Skelecton length={4}>{book.updatedAt && `上次更新: ${dayjs(book.updatedAt).fromNow()}`}</Skelecton>
        </div>
      </div>
      <div className={classes['book-status']}>
        <Skelecton length={1}>{book.status && <Tag>{book.status}</Tag>}</Skelecton>
      </div>
    </div>
  );

  if (book && book.name) {
    const basePath = `/book/${book.name}`;
    const active = decodeURIComponent(asPath).startsWith(basePath);
    return (
      <div className={[className, active ? classes['active'] : ''].join(' ').trim()}>
        <Link href={basePath} prefetch={false}>
          {content()}
        </Link>
      </div>
    );
  }

  return <div className={className}>{content()}</div>;
}
