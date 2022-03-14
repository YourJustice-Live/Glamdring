import { Container } from '@mui/material';
import Head from 'next/head';
import Navigation from "./navigation";

export default function Layout({ children, title }) {
  return (
    <>
      <Head>
        <title>{title ? title : "YourJustice"}</title>
      </Head>

      <Navigation />

      <Container sx={{ padding: '2.5rem' }}>
        {children}
      </Container>
    </>
  )
}