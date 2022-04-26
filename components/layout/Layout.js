import { Box, Container, Toolbar } from '@mui/material';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';
import { Sidebar } from 'components/layout/Sidebar';
import Head from 'next/head';

export default function Layout({ children, title, enableSidebar }) {
  return (
    <>
      <Head>
        <title>{title || 'YourJustice'}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Header />
      <Container>
        <Box sx={{ display: 'flex', py: 4 }}>
          {enableSidebar && <Sidebar />}
          <Box sx={{ flexGrow: 1 }}>
            <Toolbar />
            {children}
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
