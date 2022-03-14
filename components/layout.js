import { Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
// import purple from '@material-ui/core/colors/purple';

import Head from 'next/head';
import Header from "components/Layout/Header";
import Footer from "components/Layout/Footer";


//TODO: Add Custom Font: 'Manrope'
const fontFamily = ['Manrope', 'monospace'].join(',');
const theme = createTheme({
  palette: {
    primary: { main: '#5E42CC', },
    secondary: { main: '#05B5A1', },
  },
  typography: {
    fontFamily,
    h1:{
      fontSize: '2rem',
      fontFamily,
    },
    h2:{
      fontSize: '1.8rem',
      fontFamily,
    },
    h3:{
      fontSize: '1.6rem',
      fontFamily,
    },
    h4:{
      fontSize: '1.4rem',
      fontFamily,
    },
    h5:{
      fontSize: '1.2rem',
      fontFamily,
    },
    h6:{
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