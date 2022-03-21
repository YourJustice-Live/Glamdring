import { Button, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import LoadingBackdrop from 'components/extra/LoadingBackdrop';
import Layout from 'components/layout/Layout';
import ProfileList from 'components/profile/ProfileList';
import useAccount from "hooks/useAccount";
import useProfile from 'hooks/useProfile';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { formatAccount } from 'utils/formatters';

export default function Home() {

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
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
            <Typography gutterBottom><b>Account:</b> {formatAccount(account) || "none"}</Typography>
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
        </>
      )}
      {isLoading && <LoadingBackdrop />}
      <ProfileList />
    </Layout >
  )
}