import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BookShelf } from '@/components/BookShelf';
import { SearchPanel } from '@/components/SearchPanel';
import { headerPortalId } from '@/components/Layout/Header';
import { useGoBack } from '@/hooks/useGoBack';
import classes from './Layout.module.scss';

export interface LayoutProps {
  leftPanel?: React.ReactNode;
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { asPath } = useRouter();
  const { goBack } = useGoBack();
  const [leftPanel, setLeftPanel] = useState<React.ReactElement | undefined>(undefined);

  useEffect(() => {
    const onLeave = () => goBack({ targetPath: ['/'] });

    function getLeftPanel(leftPanel?: React.ReactElement) {
      let newLeftPanel: React.ReactElement = <BookShelf />;

      const isSearchPage = asPath.startsWith('/search');
      const isBookDetailPage = asPath.startsWith('/book');

      if (isSearchPage || (leftPanel?.type === SearchPanel && isBookDetailPage)) {
        newLeftPanel = <SearchPanel onLeave={onLeave} />;
      }

      return newLeftPanel;
    }

    setLeftPanel(getLeftPanel);
  }, [asPath, goBack]);

  return (
    <div className={classes['layout']}>
      <div className={classes['layout-content']}>
        <div className={classes['left-panel']}>
          <div id={headerPortalId('left')}></div>
          <div id="left-panel-content" className={classes['panel-content']}>
            {leftPanel}
          </div>
        </div>
        <div className={classes['right-panel']}>
          <div id={headerPortalId('right')}></div>
          <div id="right-panel-content" className={classes['panel-content']}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
