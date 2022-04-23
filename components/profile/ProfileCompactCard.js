import { PersonOutlined } from '@mui/icons-material';
import { Avatar, Box, Link, Skeleton, Typography } from '@mui/material';
import {
  REPUTATION_DOMAIN_ID,
  REPUTATION_RATING_ID,
} from 'constants/contracts';
import useProfile from 'hooks/useProfile';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';
import { getRating } from 'utils/reputation';

/**
 * A component with a compact card with profile.
 */
export default function ProfileCompactCard({
  profile,
  account,
  disableLink = false,
  disableRating = false,
  sx,
}) {
  const { showToastError } = useToasts();
  const { getProfile } = useProfile();
  const [accountProfile, setAccountProfile] = useState(null);

  useEffect(() => {
    if (!profile && account) {
      getProfile(account)
        .then((profile) => {
          setAccountProfile(profile);
        })
        .catch((error) => showToastError(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, account]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...sx,
      }}
    >
      {profile || accountProfile ? (
        <>
          <Avatar
            src={(profile || accountProfile).avatarNftUriImage}
            sx={{ width: 24, height: 24 }}
          >
            <PersonOutlined sx={{ fontSize: 16 }} />
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 'bold', ml: 1 }}>
            {disableLink ? (
              <>
                {(profile || accountProfile).avatarNftUriFirstName || 'None'}{' '}
                {(profile || accountProfile).avatarNftUriLastName || 'None'}
              </>
            ) : (
              <Link
                href={`/profile/${(profile || accountProfile).account}`}
                underline="none"
                target="_blank"
              >
                {(profile || accountProfile).avatarNftUriFirstName || 'None'}{' '}
                {(profile || accountProfile).avatarNftUriLastName || 'None'}
              </Link>
            )}
          </Typography>
          {!disableRating && (
            <>
              <Typography
                sx={{ color: 'success.main', fontWeight: 'bold', ml: 1.5 }}
              >
                +
                {getRating(
                  profile || accountProfile,
                  REPUTATION_DOMAIN_ID.environment,
                  REPUTATION_RATING_ID.positive,
                )}
              </Typography>
              <Typography
                sx={{ color: 'danger.main', fontWeight: 'bold', ml: 1 }}
              >
                -
                {getRating(
                  profile || accountProfile,
                  REPUTATION_DOMAIN_ID.environment,
                  REPUTATION_RATING_ID.negative,
                )}
              </Typography>
            </>
          )}
        </>
      ) : (
        <Skeleton variant="rectangular" width={128} height={22} />
      )}
    </Box>
  );
}
