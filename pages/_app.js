import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { DataProvider } from 'contexts/data';
import { DialogProvider } from 'contexts/dialog';
import { Web3Provider } from 'contexts/web3';
import { SnackbarProvider } from 'notistack';
import 'style/layout.scss';
import { theme } from 'theme';

function App({ Component, pageProps }) {
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
