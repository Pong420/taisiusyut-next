import React from 'react';
import { NonIdealState } from '@blueprintjs/core';
import { useAuthState } from '@/hooks/useAuth';
import classes from './BookShelf.module.scss';

export function BookShelfEmpty() {
  const auth = useAuthState();

  if (auth.loginStatus === 'loading') {
    return null;
  }

  return (
    <div className={classes['empty']}>
      <NonIdealState description="尚未加入書籍📚" />
    </div>
  );
}
