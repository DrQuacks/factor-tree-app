import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import Head from 'next/head';

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps }
}: AppProps<{ session: Session }>) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" href="/images/tree-icon.png" />
        <link rel="shortcut icon" type="image/png" href="/images/tree-icon.png" />
        <link rel="apple-touch-icon" href="/images/tree-icon.png" />
        <link rel="icon" sizes="32x32" type="image/png" href="/images/tree-icon.png" />
        <link rel="icon" sizes="16x16" type="image/png" href="/images/tree-icon.png" />
        <meta name="theme-color" content="#4A6FA5" />
      </Head>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}
