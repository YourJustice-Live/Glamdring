import { Backdrop, Button, CircularProgress, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import useAccount from "hooks/useAccount";
import useProfile from 'hooks/useProfile';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {

  const router = useRouter();
  const { account } = useAccount();
  const { getProfile, getProfiles } = useProfile();

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);

  async function loadData() {
    try {
      setProfile(await getProfile(account));
      setProfiles(await getProfiles());
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Oops, error: ${error}`, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
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
      {!isLoading && (
        <>
          {/* Account's profile */}
          <Box sx={{ marginBottom: '3rem' }}>
            <Typography variant='h4' gutterBottom>Your Profile</Typography>
            <Divider sx={{ marginBottom: '1.5rem' }} />
            <Typography gutterBottom><b>Account:</b> {account || "none"}</Typography>
            <Typography gutterBottom><b>Account has profile:</b> {profile ? "yes" : "no"}</Typography>
            {profile && (
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
            {!profile && (
              <Link href='/profile/manager' passHref>
                <Button variant="outlined">Create Own Profile</Button>
              </Link>
            )}
          </Box>
          {/* All profiles */}
          <Box>
            <Typography variant='h4' gutterBottom>All profiles</Typography>
            <Divider sx={{ marginBottom: '1.5rem' }} />
            {profiles.map((profile, index) => {
              if (profile) {
                return (
                  <Box key={index} sx={{ marginBottom: '1.0rem' }}>
                    <Typography><b>Account {index}: </b></Typography>
                    <Link href={`/profile/${profile.account}`}>
                      <a>{profile.account}</a>
                    </Link>
                  </Box>
                )
              } else {
                return null;
              }
            })}
          </Box>
        </>
      )}
      {isLoading && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
          <CircularProgress />
        </Backdrop>
      )}
    </Layout >
  )
}