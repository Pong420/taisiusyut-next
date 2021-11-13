import React from 'react';
import { IChapter } from '@/typings';
import { Icon } from '@blueprintjs/core';
import classes from './ChapterListDrawer.module.scss';

type DivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface Props extends DivProps {
  isActive?: boolean;
  chapter: Partial<IChapter>;
}

export function ChapterListItem({ isActive, chapter, ...props }: Props) {
  return (
    <div {...props} className={[classes['list-item'], isActive ? classes['active'] : ''].join(' ').trim()}>
      <div className={classes['chapter-number']}>
        {isActive ? <Icon icon="map-marker" intent="danger" /> : chapter.no}
      </div>
      <div className={classes['chapter-name']}>{chapter.name}</div>
    </div>
  );
}
