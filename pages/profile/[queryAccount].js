import { InsertPhotoOutlined } from '@mui/icons-material';
import { Avatar, Divider, Typography } from '@mui/material';
import LoadingBackdrop from 'components/extra/LoadingBackdrop';
import Layout from 'components/layout/Layout';
import useProfile from "hooks/useProfile";
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

/**
 * Page with profile data.
 */
export default function Profile() {

  const router = useRouter()
  const { queryAccount } = router.query;
  const { enqueueSnackbar } = useSnackbar();
  const { getProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  async function loadData() {
    try {
      setProfile(await getProfile(queryAccount));
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Oops, error: ${error}`, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (queryAccount) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryAccount])

  return (
    <Layout title={"YourJustice / Profile"}>
      {!isLoading && (
        <>
          <Typography variant='h4' gutterBottom>Profile</Typography>
          <Divider />
          <Avatar sx={{ width: 128, height: 128, margin: '1.5rem 0rem' }} src={profile?.avatarNftMetadata?.profilePicture ? profile.avatarNftMetadata.profilePicture : null}>
            <InsertPhotoOutlined />
          </Avatar>
          <Typography gutterBottom><b>First Name: </b>{profile?.avatarNftMetadata?.publicProfile?.firstName || "none"}</Typography>
          <Typography gutterBottom><b>Last Name:</b> {profile?.avatarNftMetadata?.publicProfile?.lastName || "none"}</Typography>
          <Typography gutterBottom><b>Email: </b> {profile?.avatarNftMetadata?.publicContacts?.email || "none"}</Typography>
          <Typography gutterBottom><b>Twitter: </b> {profile?.avatarNftMetadata?.links?.twitter || "none"}</Typography>
        </>
      )}
      {isLoading && <LoadingBackdrop />}
    </Layout>
  )

}