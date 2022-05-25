import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { DataProvider } from 'contexts/data';
import { DialogProvider } from 'contexts/dialog';
import { Web3Provider } from 'contexts/web3';
import { useRouter } from 'next/router';
import { SnackbarProvider } from 'notistack';
import posthog from 'posthog-js';
import { useEffect } from 'react';
import 'style/layout.scss';
import { theme } from 'theme';
import { IS_LOCALHOST_ANALYTICS_DISABLED } from 'constants/features';
import { EVENT } from 'constants/analytics';

function App({ Component, pageProps }) {
  const router = useRouter();

  /**
   * Init analytics
   */
  useEffect(() => {
    const isLocalhost =
      window.location.href.includes('127.0.0.1') ||
      window.location.href.includes('localhost');
    const isAnalyticsEnabled =
      (IS_LOCALHOST_ANALYTICS_DISABLED && !isLocalhost) ||
      !IS_LOCALHOST_ANALYTICS_DISABLED;
    if (isAnalyticsEnabled) {
      posthog.init(process.env.NEXT_PUBLIC_POST_HOG_KEY, {
        api_host: 'https://app.posthog.com',
      });
    }
  }, []);

  /**
   * Send page view event to analytics if page changed via router
   */
  useEffect(() => {
    const handleRouteChange = function () {
      posthog.capture(EVENT.pageView);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
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
