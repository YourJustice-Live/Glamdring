import Head from 'next/head';
import { Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

import Navigation from "./navigation";
import Header from "./Header";


const theme = createTheme({
  palette: {
    primary: {
      main: grey[900],  //Black
    },
    secondary: {
      main: grey[50],   //White
    }
  },
  typography: {
    // fontFamily: ['Space Mono', 'Montserrat', 'Open Sans'].join(','),
    h1:{
      fontSize: '2rem',
    },
    h2:{
      fontSize: '1.8rem',
    },
    h3:{
      fontSize: '1.6rem',
    },
    h4:{
      fontSize: '1.4rem',
    },
    h5:{
      fontSize: '1.2rem',
    },
    h6:{
      fontSize: '1.1rem',
    },
   }
});

export default function Layout({ children, title }) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>{title ? title : "YourJustice"}</title>
      </Head>
    <Header />
      <Navigation />

      <Container sx={{ padding: '2.5rem' }}>
        {children}
      </Container>
    </ThemeProvider>
  )
}