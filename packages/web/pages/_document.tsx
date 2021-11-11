import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { InlineScript } from '@/components/InlineScript';
import { preload } from '@/preload';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="zh-hk" className="bp4-dark" data-theme="dark" data-width="fixed" data-display="paging">
        <Head>
          <InlineScript fn={preload} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
