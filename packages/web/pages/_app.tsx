import React from 'react';
import type { AppProps /*, AppContext */ } from 'next/app';
import { Meta, CommonMeta } from '@/components/Meta';
import { Layout, LayoutProps } from '@/components/Layout';
import { BookShelf } from '@/components/BookShelf';
import { AuthProvider } from '@/hooks/useAuth';
import { GoBackProvider } from '@/hooks/useGoBack';
import { BookShelfProvider } from '@/hooks/useBookShelf';
import { PreferencesProvider } from '@/hooks/usePreferences';
import '@/styles/globals.scss';

interface ExtendAppProps extends AppProps {
  Component: AppProps['Component'] & {
    layoutProps?: Omit<LayoutProps, 'children'>;
    layout?: React.ComponentType<LayoutProps>;
    leftPanel?: React.ComponentType<unknown>;
  };
}

function AppContent(props: ExtendAppProps) {
  const { Component, pageProps } = props;
  const LeftPanel = Component.leftPanel || BookShelf;
  const component = <Component {...pageProps} />;
  if (pageProps.statusCode === 404) {
    return component;
  }
  return <Layout leftPanel={<LeftPanel />}>{component}</Layout>;
}

function App(props: ExtendAppProps) {
  return (
    <PreferencesProvider>
      <GoBackProvider>
        <AuthProvider>
          <BookShelfProvider>
            <Meta />
            <CommonMeta />
            <AppContent {...props} />
          </BookShelfProvider>
        </AuthProvider>
      </GoBackProvider>
    </PreferencesProvider>
  );
}

export default App;
