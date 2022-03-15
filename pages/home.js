import { Button, Typography } from '@mui/material';
import Layout from 'components/layout/Layout';
import useAccount from "hooks/useAccount";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {

  const router = useRouter();
  const [account] = useAccount();

  const [isAccountHasProfile, setIsAccountHasProfile] = useState(false);

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
        <>
          <Typography gutterBottom>Account: {account}</Typography>
          {!isAccountHasProfile && (
            <Link href='/profile/create' passHref>
              <Button variant="outlined">Create Own Profile</Button>
            </Link>
          )}
        </>
      )}
    </Layout>
  )
}