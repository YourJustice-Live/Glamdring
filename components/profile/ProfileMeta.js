import {
  Circle,
  FacebookRounded,
  Instagram,
  Language,
  MailOutlineRounded,
  Telegram,
  Twitter,
} from '@mui/icons-material';
import {
  Avatar,
  Button,
  Divider,
  Link,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { PROFILE_TRAIT_TYPE } from 'constants/metadata';
import useWeb3Context from 'hooks/useWeb3Context';
import { IconMember, IconProfile } from 'icons';
import NextLink from 'next/link';
import { palette } from 'theme/palette';
import { formatAddress } from 'utils/formatters';
import { getTraitValue } from 'utils/metadata';

/**
 * A component with profile meta (image, name, links).
 *
 * TODO: add emoji and multiline support for description.
 */
export default function ProfileMeta({ profile }) {
  return (
    <Box>
      {profile ? (
        <>
          <ProfileTop profile={profile} />
          <Divider sx={{ mt: 1, mb: 3 }} />
          <ProfileMain profile={profile} />
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

function ProfileTop({ profile, sx }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...sx,
      }}
    >
      <IconProfile hexColor={palette.text.secondary} size={18} />
      <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
        HUMAN
      </Typography>
      <Circle sx={{ color: 'text.secondary', fontSize: 6, ml: 1 }} />
      <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
        {formatAddress(profile?.account) || 'none'}
      </Typography>
    </Box>
  );
}

function ProfileMain({ profile, sx }) {
  const firstName =
    getTraitValue(
      profile.avatarNftUriData?.attributes,
      PROFILE_TRAIT_TYPE.firstName,
    ) || 'None';
  const lastName =
    getTraitValue(
      profile.avatarNftUriData?.attributes,
      PROFILE_TRAIT_TYPE.lastName,
    ) || 'None';
  const description = getTraitValue(
    profile.avatarNftUriData?.attributes,
    PROFILE_TRAIT_TYPE.description,
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { md: 'center' },
        ...sx,
      }}
    >
      <ProfileAvatar profile={profile} />
      <Box sx={{ mt: { xs: 2, md: 0 }, ml: { md: 4 } }}>
        <Typography variant="h2">
          {firstName} {lastName}
        </Typography>
        {description && <Typography sx={{ mt: 1 }}>{description}</Typography>}
        <ProfileLinks profile={profile} sx={{ mt: 1.5 }} />
        <ProfileEditButton profile={profile} sx={{ mt: 1 }} />
      </Box>
    </Box>
  );
}

function ProfileAvatar({ profile, sx }) {
  return (
    <Box sx={{ ...sx }}>
      <Avatar
        sx={{
          width: 164,
          height: 164,
          borderRadius: '24px',
        }}
        src={profile?.avatarNftUriData?.image}
      >
        <IconMember width="164" height="164" />
      </Avatar>
    </Box>
  );
}

function ProfileLinks({ profile, sx }) {
  const email = getTraitValue(
    profile?.avatarNftUriData?.attributes,
    PROFILE_TRAIT_TYPE.email,
  );
  const site = getTraitValue(
    profile?.avatarNftUriData?.attributes,
    PROFILE_TRAIT_TYPE.site,
  );
  const twitter = getTraitValue(
    profile?.avatarNftUriData?.attributes,
    PROFILE_TRAIT_TYPE.twitter,
  );
  const telegram = getTraitValue(
    profile?.avatarNftUriData?.attributes,
    PROFILE_TRAIT_TYPE.telegram,
  );
  const facebook = getTraitValue(
    profile?.avatarNftUriData?.attributes,
    PROFILE_TRAIT_TYPE.facebook,
  );
  const instagram = getTraitValue(
    profile?.avatarNftUriData?.attributes,
    PROFILE_TRAIT_TYPE.instagram,
  );

  return (
    <Stack direction="row" spacing={2} sx={{ ...sx }}>
      {email && (
        <Link href={`mailto:${email}`} target="_blank">
          <MailOutlineRounded />
        </Link>
      )}
      {site && (
        <Link href={site} target="_blank">
          <Language />
        </Link>
      )}
      {twitter && (
        <Link href={`https://twitter.com/${twitter}`} target="_blank">
          <Twitter />
        </Link>
      )}
      {telegram && (
        <Link href={`https://t.me/${telegram}`} target="_blank">
          <Telegram />
        </Link>
      )}
      {facebook && (
        <Link href={`https://facebook.com/${facebook}`} target="_blank">
          <FacebookRounded />
        </Link>
      )}
      {instagram && (
        <Link href={`https://instagram.com/${instagram}`} target="_blank">
          <Instagram />
        </Link>
      )}
    </Stack>
  );
}

function ProfileEditButton({ profile, sx }) {
  const { account } = useWeb3Context();
  if (profile?.account?.toLowerCase() === account?.toLowerCase()) {
    return (
      <Box sx={{ ...sx }}>
        <NextLink href={`/profile/edit`} passHref>
          <Button size="small" variant="outlined">
            Edit Profile
          </Button>
        </NextLink>
      </Box>
    );
  } else {
    return <></>;
  }
}
