import type { AppProps } from 'next/app'

import {DialogProvider} from '../components/ui-kit/dialog/dialog-context';
import { AppProvider } from '../components/context/app-context';
import '../styles/globals.css'
import '../styles/layout.css';
import ErrorPage from '../components/error-page';

function MyApp({ Component, pageProps }: AppProps) {

  if (pageProps.error) {
    return (
      <ErrorPage
        statusCode={pageProps.error.statusCode}
        message={pageProps.error.message}
      />
    );
  }

  return (
    <>
      <DialogProvider>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </DialogProvider>
    </>
  );
}

export default MyApp
