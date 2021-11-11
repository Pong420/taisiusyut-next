import React, { useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';
import { BookShelf } from '@/components/BookShelf';
import { SearchPanel } from '@/components/SearchPanel';
import { NoSSR } from '@/components/NoSSR';
import classes from './Layout.module.scss';

export interface LayoutProps {
  leftPanel?: React.ReactNode;
  children?: React.ReactNode;
}

function getLeftPanel(leftPanel?: React.ReactElement) {
  const isSearchPage = router.asPath.startsWith('/search');
  if (isSearchPage || (leftPanel?.type === SearchPanel && router.asPath.startsWith('/book'))) {
    return <SearchPanel />;
  }
  return <BookShelf />;
}

export function Layout({ children }: LayoutProps) {
  const { asPath } = useRouter();
  const [leftPanel, setLeftPanel] = useState<React.ReactElement | undefined>(undefined);

  useEffect(() => {
    setLeftPanel(getLeftPanel);
  }, [asPath]);

  return (
    <div className={classes['layout']}>
      <div className={classes['layout-content']}>
        <div className={classes['left-panel']}>
          <NoSSR>{leftPanel}</NoSSR>
        </div>
        <div className={classes['right-panel']}>{children}</div>
      </div>
    </div>
  );
}
