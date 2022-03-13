import { Typography } from '@mui/material';
import Link from 'next/link';
import Layout from '../components/layout';
import { Web3Provider } from "../contexts/web3";

export default function Index() {
  return (
    <Web3Provider>
      <Layout isIndex={true}>
        <Typography variant='h3' gutterBottom={true}>Welcome to Main Page!</Typography>
        <Typography>
          <Link href="/profile">
            <a>Profile page</a>
          </Link>
        </Typography>
      </Layout>
    </Web3Provider>
  )
}
