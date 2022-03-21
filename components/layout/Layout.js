import { Box, Container, Toolbar } from '@mui/material';
import Footer from "components/layout/Footer";
import Header from "components/layout/Header";
import Head from 'next/head';

/**
 * Component: Layout
 */
export default function Layout({ children, title }) {
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
        <Box sx={{ display: 'flex', paddingTop: '24px' }}>
          {children}
        </Box>
      </Container>
      <Footer>
        {/* [FOOTER] */}
      </Footer>
    </>
  )
}