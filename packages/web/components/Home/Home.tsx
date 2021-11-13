import React from 'react';
import { Header } from '@/components/Layout/Header';
import { Github } from '@/components/Icon/Github';
import classes from './Home.module.scss';
import { repositoryUrl } from '@/utils/repo';

export function Home() {
  return (
    <div className={classes['home']}>
      <Header />
      <div className={classes['content']}>
        <div className={classes['body']}>
          <div className={classes['title']}>Tai siu syut</div>
          <a href={repositoryUrl} target="_blank" rel="noreferrer">
            <Github width="30" height="30" />
          </a>
        </div>
      </div>
    </div>
  );
}
