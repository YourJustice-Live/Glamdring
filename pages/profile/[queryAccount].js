import { InsertPhotoOutlined } from '@mui/icons-material';
import { Avatar, Backdrop, CircularProgress, Divider, Typography } from '@mui/material';
import Layout from 'components/layout/Layout';
import useProfile from "hooks/useProfile";
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

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
          <Avatar sx={{ width: 128, height: 128, margin: '1.5rem 0rem' }} src={profile?.avatarNftMetadata?.pictureIpfsUrl ? profile.avatarNftMetadata.pictureIpfsUrl : null}>
            <InsertPhotoOutlined />
          </Avatar>
          <Typography gutterBottom><b>First Name: </b>{profile?.avatarNftMetadata?.firstName || "none"}</Typography>
          <Typography gutterBottom><b>Second Name:</b> {profile?.avatarNftMetadata?.secondName || "none"}</Typography>
          <Typography gutterBottom><b>Email: </b> {profile?.avatarNftMetadata?.email || "none"}</Typography>
        </>
      )}
      {isLoading && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
          <CircularProgress />
        </Backdrop>
      )}
    </Layout>
  )

}