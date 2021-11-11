import React from 'react';
import router from 'next/router';
import { Button } from '@blueprintjs/core';
import { Header } from '@/components/Layout/Header';
import classes from './SearchPanel.module.scss';

export function SearchPanel() {
  return (
    <div className={classes['search-panel']}>
      <Header title="Search" left={<Button icon="arrow-left" minimal onClick={() => router.back()} />}></Header>
      <div></div>
    </div>
  );
}
