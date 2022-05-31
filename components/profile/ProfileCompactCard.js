import { Avatar, Box, Chip, Link, Skeleton, Typography } from '@mui/material';
import useErrors from 'hooks/useErrors';
import useProfile from 'hooks/useProfile';
import { IconMember } from 'icons/entities';
import { useEffect, useState } from 'react';
import { formatAddress } from 'utils/formatters';

/**
 * A component with a compact card with profile.
 */
export default function ProfileCompactCard({
  profile: propsProfile,
  account: propsAccount, // TODO: Replace to id
  disableId = true,
  disableAddress = true,
  disableLink = false,
  disableRating = false,
  sx,
}) {
  const { handleError } = useErrors();
  const { getProfile } = useProfile();
  const [profile, setProfile] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    let isComponentActive = true;
    // Set profile if defined
    if (propsProfile) {
      setProfile(propsProfile);
    }
    // Else find profile by account is defined
    else if (propsAccount) {
      getProfile({ owner: propsAccount })
        .then((profile) => {
          if (isComponentActive) {
            // Set profile if found
            if (profile) {
              setProfile(profile);
            }
            // Else set account
            else {
              setAccount(propsAccount);
            }
          }
        })
        .catch((error) => handleError(error, true));
    }
    return () => {
      isComponentActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsProfile, propsAccount]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...sx,
      }}
    >
      {/* If profile is found */}
      {profile && (
        <>
          <Avatar src={profile.uriImage} sx={{ width: 24, height: 24 }}>
            <IconMember width="24" heigth="24" />
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 'bold', ml: 1 }}>
            {disableLink ? (
              <>
                {profile.uriFirstName || 'Anonymous'} {profile.uriLastName}
              </>
            ) : (
              <Link href={`/profile/${profile.id}`} underline="none">
                {profile.uriFirstName || 'Anonymous'} {profile.uriLastName}
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
      {/* If profile is not found */}
      {account && (
        <>
          <Avatar sx={{ width: 24, height: 24 }}>
            <IconMember width="24" heigth="24" />
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 'bold', ml: 1 }}>
            Unknown
          </Typography>
          <Typography sx={{ color: 'text.secondary', ml: 1 }}>
            ({formatAddress(account)})
          </Typography>
        </>
      )}
      {/* If profile or account are not defined */}
      {!profile && !account && (
        <Skeleton variant="rectangular" width={128} height={22} />
      )}
    </Box>
  );
}
