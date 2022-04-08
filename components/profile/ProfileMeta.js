import { InsertPhotoOutlined } from '@mui/icons-material';
import { Avatar, Divider, Skeleton, Typography } from '@mui/material';
import useProfile from 'hooks/useProfile';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';
import { formatAccount } from 'utils/formatters';
import { getTraitValue, traitTypes } from 'utils/metadata';

/**
 * A component with profile meta (image, name, email, socials).
 */
export default function ProfileMeta({ account }) {
  const { showToastError } = useToasts();
  const { getProfile } = useProfile();
  const [profile, setProfile] = useState(null);

  async function loadData() {
    try {
      setProfile(await getProfile(account));
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    if (account) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Profile
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {profile ? (
        <>
          <Avatar
            sx={{ width: 128, height: 128, my: 3 }}
            src={
              profile?.avatarNftMetadata?.image
                ? profile.avatarNftMetadata.image
                : null
            }
          >
            <InsertPhotoOutlined />
          </Avatar>
          <Typography gutterBottom>
            <b>Account: </b>
            {formatAccount(profile?.account) || 'none'}
          </Typography>
          <Typography gutterBottom>
            <b>First Name: </b>
            {getTraitValue(profile?.avatarNftMetadata, traitTypes.firstName) ||
              'none'}
          </Typography>
          <Typography gutterBottom>
            <b>Last Name:</b>{' '}
            {getTraitValue(profile?.avatarNftMetadata, traitTypes.lastName) ||
              'none'}
          </Typography>
          <Typography gutterBottom>
            <b>Email: </b>{' '}
            {getTraitValue(profile?.avatarNftMetadata, traitTypes.email) ||
              'none'}
          </Typography>
          <Typography gutterBottom>
            <b>Twitter: </b>{' '}
            {getTraitValue(profile?.avatarNftMetadata, traitTypes.twitter) ||
              'none'}
          </Typography>
        </>
      ) : (
        <>
          <Skeleton
            variant="rectangular"
            height={24}
            width={256}
            sx={{ mb: 1 }}
          />
          <Skeleton
            variant="rectangular"
            height={24}
            width={256}
            sx={{ mb: 1 }}
          />
        </>
      )}
    </>
  );
}
