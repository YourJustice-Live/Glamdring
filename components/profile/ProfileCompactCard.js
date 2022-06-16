import { Avatar, Box, Chip, Link, Skeleton, Typography } from '@mui/material';
import useErrors from 'hooks/useErrors';
import useProfile from 'hooks/useProfile';
import { IconMember } from 'icons/entities';
import { useEffect, useState } from 'react';
import { formatAddress, formatProfileFirstLastName } from 'utils/formatters';

/**
 * A component with a compact card with profile.
 */
export default function ProfileCompactCard({
  profile: propsProfile,
  profileId: propsProfileId,
  account: propsAccount,
  disableId = true,
  disableAddress = true,
  disableLink = false,
  disableRating = false,
  sx,
}) {
  const { handleError } = useErrors();
  const { getProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let isComponentActive = true;
    setIsLoading(true);
    setProfile(null);
    // Set profile if already defined
    if (propsProfile) {
      setProfile(propsProfile);
      setIsLoading(false);
    }
    // Else load profile by profile id or account
    else if (propsProfileId || propsAccount) {
      getProfile(
        propsProfileId ? { id: propsProfileId } : { owner: propsAccount },
      )
        .then((profile) => {
          if (isComponentActive && profile) {
            setProfile(profile);
          }
        })
        .catch((error) => handleError(error, true))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
    return () => {
      isComponentActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsProfile, propsProfileId, propsAccount]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...sx,
      }}
    >
      {/* If profile is loading */}
      {isLoading && <Skeleton variant="rectangular" width={128} height={22} />}
      {/* If profile is loaded successfully */}
      {!isLoading && profile && (
        <>
          <Avatar src={profile.uriImage} sx={{ width: 24, height: 24 }}>
            <IconMember width="24" heigth="24" />
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 'bold', ml: 1 }}>
            {disableLink ? (
              <>{formatProfileFirstLastName(profile)}</>
            ) : (
              <Link href={`/profile/${profile.id}`} underline="none">
                {formatProfileFirstLastName(profile)}
              </Link>
            )}
          </Typography>
          {!disableId && (
            <Chip size="small" label={`ID: ${profile.id}`} sx={{ ml: 1 }} />
          )}
          {!disableAddress && (
            <Typography sx={{ color: 'text.secondary', ml: 1 }}>
              ({formatAddress(profile.owner)})
            </Typography>
          )}
          {!disableRating && (
            <>
              <Typography
                sx={{ color: 'success.main', fontWeight: 'bold', ml: 1.5 }}
              >
                {`+${profile.totalPositiveRating}`}
              </Typography>
              <Typography
                sx={{ color: 'danger.main', fontWeight: 'bold', ml: 1 }}
              >
                {`-${profile.totalNegativeRating}`}
              </Typography>
            </>
          )}
        </>
      )}
      {/* If profile loading is failed */}
      {!isLoading && !profile && (
        <>
          <Avatar sx={{ width: 24, height: 24 }}>
            <IconMember width="24" heigth="24" />
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 'bold', ml: 1 }}>
            Profile not found
          </Typography>
        </>
      )}
    </Box>
  );
}
