import React, { useEffect, useState } from 'react';
import { Divider } from '@blueprintjs/core';
import { IChapter } from '@/typings';
import { ChapterGrids } from '@/components/ChapterGrids';
import { Pagination } from '@/components/Pagination';
import classes from './BookDetails.module.scss';

export interface BookDetailsChaptersProps {
  chapters: IChapter[];
}

const pageSize = 30;

export function BookDetailsChapters({ chapters }: BookDetailsChaptersProps) {
  const [pageNo, setPageNo] = useState(1);
  const start = (pageNo - 1) * pageSize;

  useEffect(() => {
    setPageNo(1);
  }, [chapters]);

  return (
    <div className={classes['chapters']}>
      <ChapterGrids chapters={chapters.slice(start, start + pageSize)}>
        <div className={classes['spacer']} />
        <Divider className={classes['divider']} />
        <Pagination onPageChange={setPageNo} pageSize={pageSize} total={chapters.length} />
      </ChapterGrids>
    </div>
  );
}
