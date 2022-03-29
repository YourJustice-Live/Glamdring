import { InsertPhotoOutlined } from '@mui/icons-material';
import { Avatar, Divider, Typography } from '@mui/material';
import LoadingBackdrop from 'components/extra/LoadingBackdrop';
import Layout from 'components/layout/Layout';
import useWeb3Context from 'hooks/useWeb3Context';
import useProfile from "hooks/useProfile";
import useToasts from 'hooks/useToasts';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { formatAccount } from 'utils/formatters';
import { getTraitValue, traitTypes } from 'utils/metadata';

/**
 * Page with profile data.
 */
export default function Profile() {

  const router = useRouter()
  const { queryAccount } = router.query;
  const { showToastError } = useToasts();
  const { account } = useWeb3Context();
  const { getProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  async function loadData() {
    try {
      setProfile(await getProfile(queryAccount));
    } catch (error) {
      showToastError(error);
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
    <Layout title={"YourJustice / Profile"} showAccountNavigation={!!account}>
      {isLoading ? (<LoadingBackdrop />) : (
        <>
          <Typography variant='h4' gutterBottom>Profile</Typography>
          <Divider />
          <Avatar sx={{ width: 128, height: 128, my: 3 }} src={profile?.avatarNftMetadata?.image ? profile.avatarNftMetadata.image : null}>
            <InsertPhotoOutlined />
          </Avatar>
          <Typography gutterBottom><b>Account: </b>{formatAccount(profile?.account) || "none"}</Typography>
          <Typography gutterBottom><b>First Name: </b>{getTraitValue(profile?.avatarNftMetadata, traitTypes.firstName) || "none"}</Typography>
          <Typography gutterBottom><b>Last Name:</b> {getTraitValue(profile?.avatarNftMetadata, traitTypes.lastName) || "none"}</Typography>
          <Typography gutterBottom><b>Email: </b> {getTraitValue(profile?.avatarNftMetadata, traitTypes.email) || "none"}</Typography>
          <Typography gutterBottom><b>Twitter: </b> {getTraitValue(profile?.avatarNftMetadata, traitTypes.twitter) || "none"}</Typography>
        </>
      )}
    </Layout >
  )

}