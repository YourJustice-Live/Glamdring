import { Box, Container, Toolbar } from '@mui/material';
import Footer from "components/layout/Footer";
import Header from "components/layout/Header";
import Head from 'next/head';
import AccountNavigation from './AccountNavigation';

/**
 * Component: Layout
 */
export default function Layout({ children, title, showAccountNavigation }) {
  return (
    <>
      <Head>
        <title>{title ? title : "YourJustice"}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Header>
      </Header>
      <Container>
        <Toolbar />
        <Box sx={{ display: 'flex', py: '24px' }}>
          {showAccountNavigation && <AccountNavigation />}
          <Box sx={{ flexGrow: 1 }}>
            {children}
          </Box>
        </Box>
      </Container>
      <Footer>
        {/* [FOOTER] */}
      </Footer>
    </>
  )
}