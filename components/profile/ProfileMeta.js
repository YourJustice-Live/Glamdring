import { PersonOutlined } from '@mui/icons-material';
import { Avatar, Button, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import useWeb3Context from 'hooks/useWeb3Context';
import NextLink from 'next/link';
import { formatAddress } from 'utils/formatters';
import { getTraitValue, traitTypes } from 'utils/metadata';

/**
 * A component with profile meta (image, name, email, socials).
 */
export default function ProfileMeta({ profile }) {
  const { account } = useWeb3Context();
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
          {profile.account?.toLowerCase() === account?.toLowerCase() && (
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
