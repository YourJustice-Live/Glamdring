import { Box, Container, Toolbar } from '@mui/material';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';
import { Sidebar } from 'components/layout/Sidebar';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

export default function Layout({
  children,
  title,
  enableSidebar = false,
  maxWidth,
  background,
}) {
  const { t } = useTranslation('common');

  return (
    <Box sx={{ background: background }}>
      <Head>
        <title>{title || t('page-title-default')}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Header />
      <Container maxWidth={maxWidth ? maxWidth : enableSidebar ? 'lg' : 'md'}>
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
