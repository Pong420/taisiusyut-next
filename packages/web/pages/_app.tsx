import React from 'react';
import type { AppProps /*, AppContext */ } from 'next/app';
import { Meta, CommonMeta } from '@/components/Meta';
import { Layout, LayoutProps } from '@/components/Layout';
import { BookShelf } from '@/components/BookShelf';
import { AuthProvider } from '@/hooks/useAuth';
import { GoBackProvider } from '@/hooks/useGoBack';
import { BookShelfProvider } from '@/hooks/useBookShelf';
import { BreakPointsProvider } from '@/hooks/useBreakPoints';
import { PreferencesProvider } from '@/hooks/usePreferences';
import { composeProviders } from '@/utils/composeProviders';
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

const Provider = composeProviders(
  AuthProvider,
  PreferencesProvider,
  BookShelfProvider,
  BreakPointsProvider,
  GoBackProvider
);

function App(props: ExtendAppProps) {
  return (
    <Provider>
      <>
        <Meta />
        <CommonMeta />
        <AppContent {...props} />
      </>
    </Provider>
  );
}

export default App;
