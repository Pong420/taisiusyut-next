import React from 'react';
import Link from 'next/link';
import { IChapter } from '@/typings';
import { Card, CardProps, Classes, Icon, Tag } from '@blueprintjs/core';
import classes from './ChapterGrids.module.scss';

export interface ChapterGridsProps extends CardProps {
  bookName?: string;
  provider?: string;
  children?: React.ReactNode;
  chapters: Partial<IChapter>[];
  lastVistChapter?: number;
}

const itemClassName = [Classes.MENU_ITEM, classes['chapter-item']].join(' ');

export function ChapterGrids({
  bookName,
  provider,
  chapters,
  children,
  lastVistChapter,
  className,
  ...props
}: ChapterGridsProps) {
  const maxLength = String(chapters.slice(-1)[0]?.no || '').length;

  return (
    <Card {...props} className={`${classes['grid-container']} ${className}`}>
      <div className={classes['head']}>章節目錄</div>
      <div className={classes['grid']}>
        {chapters.map(chapter => {
          const tagName = String(chapter.no || '').padStart(maxLength, '0');
          const content = (
            <>
              {typeof lastVistChapter === 'number' && lastVistChapter === chapter.no ? (
                <Icon className={classes['map-maker']} icon="map-marker" />
              ) : (
                <Tag minimal className={classes['tag']}>
                  {tagName}
                </Tag>
              )}
              <span className={classes['chapter-name']}>{chapter.name}</span>
            </>
          );

          if (bookName && provider) {
            return (
              <Link key={chapter.id} prefetch={false} href={`/book/${provider}/${bookName}/${chapter.no}`}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className={itemClassName}>{content}</a>
              </Link>
            );
          }

          return (
            <div key={chapter.id} className={itemClassName}>
              {content}
            </div>
          );
        })}
      </div>
      {children}
    </Card>
  );
}
