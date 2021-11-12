import React from 'react';
import router from 'next/router';
import { Button } from '@blueprintjs/core';
import { Header } from '@/components/Layout/Header';
import { SearchForm, useForm } from './SearchForm';
import { SearchItem } from './SearchItem';
import classes from './SearchPanel.module.scss';

const book = {};

export function SearchPanel() {
  return (
    <div className={classes['panel']}>
      <Header title="搜索書籍" left={<Button icon="arrow-left" minimal onClick={() => router.back()} />}></Header>
      <div className={classes['content']}>
        <SearchForm />

        <div className={classes['items']}>
          <div className={classes['border']} />

          {Array.from({ length: 10 }, (_, idx) => (
            <SearchItem book={book} key={idx}></SearchItem>
          ))}
        </div>
      </div>
    </div>
  );
}
