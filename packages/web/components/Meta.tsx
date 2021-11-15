import { ReactNode } from 'react';
import Head from 'next/head';

interface Props {
  title?: string;
  keywords?: string;
  description?: string;
  robots?: string;
  children?: ReactNode;
}

const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
const vercelOrgin = vercelUrl ? `https://${vercelUrl}` : '';
const Origin = process.env.NEXT_PUBLIC_Origin || vercelOrgin || '';

export function Meta({
  children,
  title = '睇小說',
  keywords = '睇小說',
  description = '睇小說',
  robots = 'all'
}: Props) {
  return (
    <Head>
      <title key="title">{title}</title>

      <meta key="robots" name="robots" content={robots} />
      <meta key="googlebot" name="googlebot" content={robots} />
      <meta key="keywords" name="keywords" content={keywords} />
      <meta key="description" name="description" content={description} />

      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:title" property="og:title" content={title} />
      <meta key="og:description" property="og:description" content={description} />
      <meta key="og:site_name" property="og:site_name" content="睇小說" />
      <meta key="og:url" property="og:url" content={Origin} />
      <meta key="og:image" property="og:image" content={`${Origin}/icons/apple-touch-icon.png`} />
      {children}
    </Head>
  );
}

export function CommonMeta() {
  return (
    <Head>
      <meta
        name="viewport"
        content="initial-scale=1.0, maximum-scale=5.0, shrink-to-fit=no, user-scalable=no, width=device-width, viewport-fit=cover"
      />

      <meta name="color-scheme" content="dark light" />

      <meta name="google" content="notranslate" />

      <meta name="application-name" content="睇小說" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="睇小說" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="description" content="睇小說" />
      <meta name="format-detection" content="telephone=no" />

      <meta name="msapplication-config" content="/icons/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#000000" />

      <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      {/* https://developer.yoast.com/blog/safari-pinned-tab-icon-mask-icon/ */}
      <link rel="mask-icon" href="/icon.svg" color="#ffffff" />
      <link rel="shortcut icon" href="/favicon.ico" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content={Origin} />
      <meta name="twitter:title" content="睇小說" />
      <meta name="twitter:description" content="睇小說" />
      <meta name="twitter:image" content={`${Origin}/icons/android-chrome-192x192.png`} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="睇小說" />
      <meta property="og:description" content="Best 睇小說 in the world" />
      <meta property="og:site_name" content="睇小說" />
      <meta property="og:url" content={Origin} />
      <meta property="og:image" content={`${Origin}/icons/apple-touch-icon.png`} />

      {/*  apple splash screen images */}
      {/* https://appsco.pe/developer/splash-screens */}
      <link
        href="splashscreens/iphone5_splash.png"
        media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="splashscreens/iphone6_splash.png"
        media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="splashscreens/iphoneplus_splash.png"
        media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image"
      />
      <link
        href="splashscreens/iphonex_splash.png"
        media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image"
      />
      <link
        href="splashscreens/iphonexr_splash.png"
        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="splashscreens/iphonexsmax_splash.png"
        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image"
      />
      <link
        href="splashscreens/ipad_splash.png"
        media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="splashscreens/ipadpro1_splash.png"
        media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="splashscreens/ipadpro3_splash.png"
        media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="splashscreens/ipadpro2_splash.png"
        media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
    </Head>
  );
}
