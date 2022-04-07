import Head from 'next/head';
import { Box, Container, Toolbar } from '@mui/material';
import {
  DrawerAccountNavigation,
  PaperAccountNavigation,
} from 'components/layout/AccountNavigation';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';

export default function Layout({ children, title, showAccountNavigation }) {
  return (
    <>
      <Head>
        <title>{title || 'YourJustice'}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Header />
      <Container>
        <Box sx={{ display: 'flex', py: 4 }}>
          {showAccountNavigation && (
            <DrawerAccountNavigation
              sx={{ display: { xs: 'none', md: 'block' } }}
            />
          )}
          <Box sx={{ flexGrow: 1 }}>
            <Toolbar />
            {showAccountNavigation && (
              <PaperAccountNavigation
                sx={{ display: { xs: 'block', md: 'none' } }}
              />
            )}
            {children}
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
