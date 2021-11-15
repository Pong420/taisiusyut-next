import React from 'react';
import { Card, Icon } from '@blueprintjs/core';
import classes from './BookDetails.module.scss';

export function ChapterListDrawerCard({ onClick }: { onClick?: () => void }) {
  return (
    <Card interactive className={classes['card']} onClick={onClick}>
      <div>章節目錄</div>
      <Icon icon="chevron-right" />
    </Card>
  );
}
