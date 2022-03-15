import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Web3Provider } from "contexts/web3";
import { SnackbarProvider } from 'notistack';
import 'styles/globals.scss';

const fontFamily = ['Manrope', 'monospace'].join(',');
const theme = createTheme({
  palette: {
    primary: { main: '#5E42CC', },
    secondary: { main: '#05B5A1', },
  },
  typography: {
    fontFamily,
    h1: {
      fontSize: '2rem',
      fontFamily,
    },
    h2: {
      fontSize: '1.8rem',
      fontFamily,
    },
    h3: {
      fontSize: '1.6rem',
      fontFamily,
    },
    h4: {
      fontSize: '1.4rem',
      fontFamily,
    },
    h5: {
      fontSize: '1.2rem',
      fontFamily,
    },
    h6: {
      fontSize: '1.1rem',
      fontFamily,
    },
  }
});

function App({ Component, pageProps }) {

  return (
    <Web3Provider>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={1}>
          <Component {...pageProps} />
        </SnackbarProvider>
      </ThemeProvider>
    </Web3Provider>
  )

}

export default App;
