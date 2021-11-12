import React, { useRef, useState } from 'react';
import { Card, CardProps } from '@blueprintjs/core';
import { BookModel } from '@/components/BookModel';
import { Skelecton } from '@/components/Skelecton';
import { IBookDetails } from '@/typings';
import defaultClasses from './BookInfoCard.module.scss';

interface Props extends CardProps {
  author?: boolean;
  book: Partial<IBookDetails>;
  bookModelSize?: number;
  classes?: typeof defaultClasses;
}

export function BookInfoCard({
  classes: _classes,
  className = '',
  children,
  bookModelSize = 70,
  book,
  ...props
}: Props) {
  const [classes] = useState(() => ({ ...defaultClasses, ..._classes }));
  const descriptionRef = useRef<HTMLDivElement>(null);
  const { author } = book;

  return (
    <Card elevation={1} {...props} className={`${classes['book']} ${className}`.trim()}>
      <div className={classes['book-model-container']}>
        <BookModel width={bookModelSize} className={classes['book-model']} />
      </div>

      <div className={classes['content']}>
        <div className={classes['header']}>
          <span className={classes['name']}>
            <Skelecton length={3}>{book.name}</Skelecton>
          </span>
          <span className={classes['author']}>
            <Skelecton length={2}>{author && `${author} 著`}</Skelecton>
          </span>
        </div>

        <div className={classes['description']} ref={descriptionRef}>
          <Skelecton length={30} emptyString={false}>
            {book.description}
          </Skelecton>
        </div>
      </div>

      {children}
    </Card>
  );
}
