import React from 'react';
import type { AppProps /*, AppContext */ } from 'next/app';
import { Layout, LayoutProps } from '@/components/Layout';
import { BookShelf } from '@/components/BookShelf';
import { AuthProvider } from '@/hooks/useAuth';
import { PreferencesProvider } from '@/hooks/usePreferences';
import '@/styles/globals.scss';

interface ExtendAppProps extends AppProps {
  Component: AppProps['Component'] & {
    layoutProps?: Omit<LayoutProps, 'children'>;
    layout?: React.ComponentType<LayoutProps>;
    leftPanel?: React.ComponentType<{}>;
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
    <AuthProvider>
      <PreferencesProvider>
        <AppContent {...props} />
      </PreferencesProvider>
    </AuthProvider>
  );
}

export default App;
