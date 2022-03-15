import { Container } from '@mui/material';
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
      </Head>
      <Header>
      </Header>
      <Container sx={{ padding: '2.5rem' }}>
        {children}
      </Container>
      <Footer>
        {/* [FOOTER] */}
      </Footer>
    </>
  )
}