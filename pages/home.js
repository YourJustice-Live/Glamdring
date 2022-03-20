import { Button, Typography } from '@mui/material';
import Layout from 'components/layout/Layout';
import useAccount from "hooks/useAccount";
import useAvatarNftContract from "hooks/useAvatarNftContract";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {

  const router = useRouter();
  const { account } = useAccount();
  const { getBalance } = useAvatarNftContract();

  const [accountAvatarNftBalance, setAccountAvatarNftBalance] = useState(null);

  async function loadData() {
    setAccountAvatarNftBalance(await getBalance(account));
  }

  useEffect(() => {
    // Redirect to index page if account not connected
    if (!account) {
      router.push('/');
    }
    else {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <Layout title={"YourJustice / Home"}>
      {account && accountAvatarNftBalance && (
        <>
          <Typography gutterBottom><b>Account:</b> {account}</Typography>
          <Typography gutterBottom><b>Account Avatar NFT balance:</b> {accountAvatarNftBalance}</Typography>
          <Typography gutterBottom><b>Account has Avatar NFT:</b> {accountAvatarNftBalance !== "0" ? "yes" : "no"}</Typography>
          {accountAvatarNftBalance === "0" && (
            <Link href='/profile/manager' passHref>
              <Button variant="outlined">Create Own Profile</Button>
            </Link>
          )}
          {accountAvatarNftBalance !== "0" && (
            <>
              <Link href='/profile' passHref>
                <Button variant="outlined">Open Own Profile</Button>
              </Link>
              {" "}
              <Link href='/profile/manager' passHref>
                <Button variant="outlined">Edit Own Profile</Button>
              </Link>
            </>
          )}
        </>
      )}
    </Layout>
  )
}