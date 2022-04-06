import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { Web3Provider } from 'contexts/web3';
import { CssBaseline } from '@mui/material';
import { theme } from 'theme';
import "style/layout.scss";

function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <Web3Provider>
          <Component {...pageProps} />
        </Web3Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
