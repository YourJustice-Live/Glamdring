import { Box, Divider } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from "./navigation";

export default function Layout({ children, isIndex, title }) {
  return (
    <Box sx={{ flexGrow: 1 }}>

      <Head>
        <title>{title ? title : "YourJustice"}</title>
        <meta name="description" content="Decentralized Reputation & Justice System for Web3 & Real World Issues" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <Box sx={{ padding: '2.5rem' }}>
        {children}
      </Box>

      {
        !isIndex && (
          <Box sx={{ padding: '0rem 2.5rem' }}>
            <Divider sx={{ marginBottom: '1rem' }} />
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </Box>
        )
      }
    </Box >
  )
}