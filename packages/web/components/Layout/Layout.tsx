import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BookShelf } from '@/components/BookShelf';
import { SearchPanel } from '@/components/SearchPanel';
import { headerPortalId } from '@/components/Layout/Header';
import { useGoBack } from '@/hooks/useGoBack';
import { useAuthState } from '@/hooks/useAuth';
import { usePreferencesState } from '@/hooks/usePreferences';
import classes from './Layout.module.scss';
import { useBreakPoints } from '@/hooks/useBreakPoints';

export interface LayoutProps {
  leftPanel?: React.ReactNode;
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { asPath } = useRouter();
  const { goBack } = useGoBack();
  const { loginStatus } = useAuthState();
  const { pagingDisplay } = usePreferencesState();
  const [breakPoint, mounted] = useBreakPoints();
  const singlePage = breakPoint <= 768 || !pagingDisplay;
  const [leftPanel, setLeftPanel] = useState<React.ReactNode>(null);

  useEffect(() => {
    const onLeave = () => goBack({ targetPath: ['/'] });

    function getLeftPanel(leftPanel?: React.ReactElement) {
      const isHomePage = asPath === '/';
      const isBookPage = asPath.startsWith('/book');
      const isSearchPage = asPath.startsWith('/search');

      if (isSearchPage) {
        const persists = singlePage ? false : leftPanel?.type === SearchPanel && isBookPage;
        if (persists) {
          return <SearchPanel onLeave={onLeave} />;
        }
      }

      if (!singlePage || (isHomePage && loginStatus === 'loggedIn')) {
        return <BookShelf />;
      }

      return null;
    }

    setLeftPanel(getLeftPanel);
  }, [asPath, goBack, loginStatus, singlePage]);

  const hideRightPanel = singlePage ? !!leftPanel || loginStatus === 'unknown' || loginStatus === 'loading' : !mounted;

  return (
    <div className={classes['layout']}>
      <div className={classes['layout-content']}>
        <div className={classes['left-panel']} hidden={!leftPanel}>
          <div id={headerPortalId('left')}></div>
          <div id="left-panel-content" className={classes['panel-content']}>
            {leftPanel}
          </div>
        </div>
        <div className={classes['right-panel']} hidden={hideRightPanel}>
          <div id={headerPortalId('right')}></div>
          <div id="right-panel-content" className={classes['panel-content']}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
