import React from 'react';
import { Header } from '@/components/Layout/Header';
import classes from './Home.module.scss';

export function Home() {
  return (
    <div className={classes['home']}>
      <Header />
      <div className={classes['content']}>Tai siu syut</div>
    </div>
  );
}
