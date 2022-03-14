import { Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '../components/layout';
import useAccount from "../hooks/useAccount";

export default function Index() {

  const router = useRouter();
  const [account] = useAccount();

  useEffect(() => {
    // Redirect to index page if account not connected
    if (account) {
      router.push('/home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <Layout>
      <Typography variant='h5' align='center' gutterBottom>Check reputation of the person, you are interested in.</Typography>
      <Typography variant='h6' align='center'>Or check yourself!</Typography>
    </Layout>
  )

}
