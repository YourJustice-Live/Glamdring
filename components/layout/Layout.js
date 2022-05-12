import { Box, Container, Toolbar } from '@mui/material';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';
import { Sidebar } from 'components/layout/Sidebar';
import Head from 'next/head';

export default function Layout({ children, title, enableSidebar, background }) {
  return (
    <Box sx={{ background: background }}>
      <Head>
        <title>{title || 'YourJustice'}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Header />
      <Container>
        <Box sx={{ display: 'flex' }}>
          {enableSidebar && <Sidebar />}
          <Box sx={{ flexGrow: 1, py: 4 }}>
            <Toolbar />
            {children}
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
