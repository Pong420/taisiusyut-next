import React, { useState } from 'react';
import { Divider } from '@blueprintjs/core';
import { IChapter } from '@/typings';
import { ChapterGrids } from '@/components/ChapterGrids';
import { Pagination } from '@/components/Pagination';
import classes from './BookDetails.module.scss';

export interface BookDetailsChaptersProps {
  chapters: IChapter[];
}

const pageSize = 30;

export function BookDetailsChapters({ chapters: allChapters }: BookDetailsChaptersProps) {
  const [chapters, setChapters] = useState(allChapters.slice(0, pageSize));

  const onPageChange = (pageNo: number) => {
    const start = (pageNo - 1) * pageSize;
    setChapters(allChapters.slice(start, start + pageSize));
  };

  return (
    <div className={classes['chapters']}>
      <ChapterGrids chapters={chapters.slice(0, 30)}>
        <div className={classes['spacer']} />
        <Divider className={classes['divider']} />
        <Pagination onPageChange={onPageChange} pageSize={pageSize} total={allChapters.length} />
      </ChapterGrids>
    </div>
  );
}
