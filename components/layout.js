/* eslint-disable @next/next/no-page-custom-font */
import { Container } from '@mui/material';
import Head from 'next/head';
import Navigation from "./navigation";

export default function Layout({ children, title }) {
  return (
    <>
      <Head>
        <title>{title ? title : "YourJustice"}</title>
        <meta name="description" content="Decentralized Reputation & Justice System for Web3 & Real World Issues" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <Container sx={{ padding: '2.5rem' }}>
        {children}
      </Container>
    </>
  )
}