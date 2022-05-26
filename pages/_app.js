import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { DataProvider } from 'contexts/data';
import { DialogProvider } from 'contexts/dialog';
import { Web3Provider } from 'contexts/web3';
import { useRouter } from 'next/router';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import 'style/layout.scss';
import { theme } from 'theme';
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
              <Component {...pageProps} />
            </DialogProvider>
          </DataProvider>
        </Web3Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
