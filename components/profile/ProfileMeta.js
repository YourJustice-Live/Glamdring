import { PersonOutlined } from '@mui/icons-material';
import { Avatar, Button, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import useProfile from 'hooks/useProfile';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { formatAddress } from 'utils/formatters';
import { getTraitValue, traitTypes } from 'utils/metadata';

/**
 * A component with profile meta (image, name, email, socials).
 */
export default function ProfileMeta({ account }) {
  const { account: connectedAccount } = useWeb3Context();
  const { showToastError } = useToasts();
  const { getProfile } = useProfile();
  const [profile, setProfile] = useState(null);

  async function loadData() {
    try {
      const profile = await getProfile(account);
      setProfile(profile);
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
    <Box>
      {profile ? (
        <>
          {/* Avatar */}
          <Avatar
            sx={{ width: 128, height: 128, my: 3 }}
            src={profile.avatarNftUriData.image}
          >
            <PersonOutlined />
          </Avatar>
          {/* Traits */}
          <Typography gutterBottom>
            <b>Account: </b>
            {formatAddress(profile?.account) || 'none'}
          </Typography>
          <Typography gutterBottom>
            <b>First Name: </b>
            {getTraitValue(profile.avatarNftUriData, traitTypes.firstName) ||
              'none'}
          </Typography>
          <Typography gutterBottom>
            <b>Last Name:</b>{' '}
            {getTraitValue(profile.avatarNftUriData, traitTypes.lastName) ||
              'none'}
          </Typography>
          <Typography gutterBottom>
            <b>Email: </b>{' '}
            {getTraitValue(profile.avatarNftUriData, traitTypes.email) ||
              'none'}
          </Typography>
          <Typography gutterBottom>
            <b>Twitter: </b>{' '}
            {getTraitValue(profile.avatarNftUriData, traitTypes.twitter) ||
              'none'}
          </Typography>
          {/* Edit profile button */}
          {account?.toLowerCase() === connectedAccount?.toLowerCase() && (
            <Box sx={{ mt: 4 }}>
              <NextLink href={`/profile/edit`} passHref>
                <Button variant="outlined">Edit Profile</Button>
              </NextLink>
            </Box>
          )}
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
    </Box>
  );
}
