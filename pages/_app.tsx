import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { ThemeProvider } from 'next-themes';
import { ServicesProvider } from '../contexts/ServicesContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Nova Assistant</title>
        <meta name="description" content="AI-powered personal assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ServicesProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ServicesProvider>
      </ThemeProvider>
    </>
  );
}
