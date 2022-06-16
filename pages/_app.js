import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { DataProvider } from 'contexts/data';
import { DialogProvider } from 'contexts/dialog';
import { Web3Provider } from 'contexts/web3';
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import NextNProgress from 'nextjs-progressbar';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import 'style/layout.scss';
import { theme } from 'theme';
import { palette } from 'theme/palette';
import { handlePageViewEvent, initAnalytics } from 'utils/analytics';

function App({ Component, pageProps }) {
  const router = useRouter();

  /**
   * Init analytics
   */
  useEffect(() => {
    initAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Send page view event to analytics if page changed via router
   */
  useEffect(() => {
    const handleRouteChange = function () {
      handlePageViewEvent();
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.events]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <Web3Provider>
          <DataProvider>
            <DialogProvider>
              <NextNProgress color={palette.primary.main} height={4} />
              <Component {...pageProps} />
            </DialogProvider>
          </DataProvider>
        </Web3Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default appWithTranslation(App);
