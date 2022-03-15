import { Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Footer from "components/layout/Footer";
import Header from "components/layout/Header";
import Head from 'next/head';

// TODO: Add Custom Font: 'Manrope'
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

/**
 * Component: Layout
 */
export default function Layout({ children, title }) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>{title ? title : "YourJustice"}</title>
      </Head>
      <Header>
      </Header>
      <Container sx={{ padding: '2.5rem' }}>
        {children}
      </Container>
      <Footer>
        {/* [FOOTER] */}
      </Footer>
    </ThemeProvider>
  )
}