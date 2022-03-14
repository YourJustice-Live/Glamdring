import { Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '../components/layout';
import useAccount from "../hooks/useAccount";

export default function Home() {

  const router = useRouter();
  const [account] = useAccount();

  useEffect(() => {
    // Redirect to index page if account not connected
    if (!account) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <Layout title={"YourJustice / Home"}>
      {account && (
        <Typography>Account: {account}</Typography>
      )}
    </Layout>
  )
}