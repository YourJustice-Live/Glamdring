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
  Chip,
  Divider,
  Link,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import InteractiveAddress from 'components/address/InteractiveAddress';
import { PROFILE_TRAIT_TYPE } from 'constants/metadata';
import useWeb3Context from 'hooks/context/useWeb3Context';
import { IconProfile } from 'icons/core';
import { IconMember } from 'icons/entities';
import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';
import { palette } from 'theme/palette';
import { formatProfileFirstLastName } from 'utils/formatters';
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
            width={164}
            sx={{ mb: 1 }}
          />
        </>
      )}
    </Box>
  );
}

function ProfileTop({ profile, sx }) {
  const { t } = useTranslation('common');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...sx,
      }}
    >
      <IconProfile color={palette.text.secondary} width="18" height="18" />
      <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
        {t('text-profile').toUpperCase()}
      </Typography>
      <Circle sx={{ color: 'text.secondary', fontSize: 6, ml: 1 }} />
      <InteractiveAddress
        address={profile.owner}
        link={`${window.location.origin}/profile/${profile.id}`}
        sx={{ ml: 1 }}
      />
    </Box>
  );
}

function ProfileMain({ profile, sx }) {
  const description = getTraitValue(
    profile.uriData?.attributes,
    PROFILE_TRAIT_TYPE.description,
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        ...sx,
      }}
    >
      <Box>
        <ProfileAvatar profile={profile} />
        <ProfileEditButton profile={profile} sx={{ mt: 2, width: 164 }} />
      </Box>
      <Box sx={{ mt: { xs: 2, md: 0 }, ml: { md: 4 } }}>
        <Chip label={`ID: ${profile?.id}`} sx={{ height: '24px', mb: 1.5 }} />
        <Typography variant="h2">
          {formatProfileFirstLastName(profile)}
        </Typography>
        {description && <Typography sx={{ mt: 1 }}>{description}</Typography>}
        <ProfileLinks profile={profile} sx={{ mt: 1.5 }} />
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
        src={profile?.uriData?.image}
      >
        <IconMember width="164" height="164" />
      </Avatar>
    </Box>
  );
}

function ProfileLinks({ profile, sx }) {
  const email = getTraitValue(
    profile?.uriData?.attributes,
    PROFILE_TRAIT_TYPE.email,
  );
  const site = getTraitValue(
    profile?.uriData?.attributes,
    PROFILE_TRAIT_TYPE.site,
  );
  const twitter = getTraitValue(
    profile?.uriData?.attributes,
    PROFILE_TRAIT_TYPE.twitter,
  );
  const telegram = getTraitValue(
    profile?.uriData?.attributes,
    PROFILE_TRAIT_TYPE.telegram,
  );
  const facebook = getTraitValue(
    profile?.uriData?.attributes,
    PROFILE_TRAIT_TYPE.facebook,
  );
  const instagram = getTraitValue(
    profile?.uriData?.attributes,
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
  const { t } = useTranslation('common');

  const { account } = useWeb3Context();
  if (profile?.owner?.toLowerCase() === account?.toLowerCase()) {
    return (
      <NextLink href={`/profile/edit`} passHref>
        <Button size="small" variant="outlined" sx={{ ...sx }}>
          {t('button-profile-edit')}
        </Button>
      </NextLink>
    );
  } else {
    return <></>;
  }
}
