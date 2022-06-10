import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Link,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import CaseCreateDialog from 'components/case/CaseCreateDialog';
import useDataContext from 'hooks/context/useDataContext';
import useDialogContext from 'hooks/context/useDialogContext';
import { IconArrowUp2, IconArrowDown2 } from 'icons/core';
import { IconMember } from 'icons/entities';
import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';
import { palette } from 'theme/palette';
import { formatAddress, formatProfileFirstLastName } from 'utils/formatters';

/**
 * A component with a card with profile.
 */
export default function ProfileCard({ profile, jurisdiction }) {
  return (
    <Card elevation={1}>
      {profile ? (
        <CardContent sx={{ p: '10px !important' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: { xs: 'flex-start', md: 'space-between' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                flexGrow: 1,
              }}
            >
              <ProfileImage profile={profile} sx={{ mr: 2 }} />
              <ProfileDetails profile={profile} />
            </Box>
            <ProfileCaseStats profile={profile} sx={{ mr: 6 }} />
            <ProfileActions profile={profile} jurisdiction={jurisdiction} />
          </Box>
        </CardContent>
      ) : (
        <CardContent>
          <Stack direction="row" spacing={2}>
            <Skeleton
              variant="circular"
              width={82}
              height={82}
              sx={{ borderRadius: '16px' }}
            />
            <Box>
              <Skeleton variant="rectangular" width={164} height={24} />
              <Skeleton
                variant="rectangular"
                width={82}
                height={16}
                sx={{ mt: 1 }}
              />
            </Box>
          </Stack>
        </CardContent>
      )}
    </Card>
  );
}

function ProfileImage({ profile, sx }) {
  if (profile) {
    return (
      <Box sx={{ ...sx }}>
        <NextLink href={`/profile/${profile.id}`} passHref>
          <Avatar
            sx={{
              cursor: 'pointer',
              width: 82,
              height: 82,
              borderRadius: '16px',
            }}
            src={profile.uriImage}
          >
            <IconMember width="82" heigth="82" />
          </Avatar>
        </NextLink>
      </Box>
    );
  }

  return <></>;
}

function ProfileDetails({ profile, sx }) {
  if (profile) {
    return (
      <Box sx={{ ...sx }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', mb: 0.3 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 'bold', color: 'success.main', mr: 1 }}
          >
            {`+${profile.totalPositiveRating}`}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 'bold', color: 'danger.main', mr: 1 }}
          >
            {`-${profile.totalNegativeRating}`}
          </Typography>
        </Box>
        <NextLink href={`/profile/${profile.id}`} passHref>
          <Link underline="none">{formatProfileFirstLastName(profile)}</Link>
        </NextLink>
        <Typography variant="body2" color="text.secondary">
          {formatAddress(profile.owner)}
        </Typography>
      </Box>
    );
  }

  return <></>;
}

function ProfileCaseStats({ profile, sx }) {
  const { t } = useTranslation('common');

  function Item({ value, title, titleColor }) {
    return (
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 'bold', mb: 0.5 }}>
          {value}
        </Typography>
        <Typography sx={{ color: titleColor, fontSize: 12 }}>
          {title}
        </Typography>
      </Box>
    );
  }

  if (profile) {
    const totalCases =
      Number(profile.totalPositiveCases) + Number(profile.totalNegativeCases);
    return (
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        alignItems="center"
        spacing={2}
        sx={{ my: 1.5, ...sx }}
      >
        <Item
          value={totalCases}
          title={t('text-profile-cases').toUpperCase()}
        />
        <Item
          value={profile.totalPositiveCases}
          title={t('text-profile-positive-cases').toUpperCase()}
          titleColor={palette.success.main}
        />
        <Item
          value={profile.totalNegativeCases}
          title={t('text-profile-negative-cases').toUpperCase()}
          titleColor={palette.danger.main}
        />
      </Stack>
    );
  }

  return <></>;
}

function ProfileActions({ profile, jurisdiction }) {
  const { t } = useTranslation('common');
  const { accountProfile } = useDataContext();
  const { showDialog, closeDialog } = useDialogContext();

  if (profile) {
    return (
      <Stack
        direction={{ xs: 'row', md: 'column' }}
        spacing={1}
        justifyContent="center"
        alignItems="flex-start"
        sx={{ mr: { xs: 0, md: 2 } }}
      >
        <Button
          variant="text"
          color="success"
          size="small"
          startIcon={<IconArrowUp2 color={palette.success.main} />}
          sx={{ flex: { xs: 1, md: 0 } }}
          onClick={() =>
            showDialog(
              <CaseCreateDialog
                isPositive={true}
                jurisdiction={jurisdiction}
                subjectProfile={profile}
                affectedProfile={accountProfile}
                onClose={closeDialog}
              />,
            )
          }
        >
          {t('button-profile-increase-reputation')}
        </Button>
        <Button
          variant="text"
          color="danger"
          size="small"
          startIcon={<IconArrowDown2 color={palette.danger.main} />}
          sx={{ flex: { xs: 1, md: 0 } }}
          onClick={() =>
            showDialog(
              <CaseCreateDialog
                isPositive={false}
                jurisdiction={jurisdiction}
                subjectProfile={profile}
                affectedProfile={accountProfile}
                onClose={closeDialog}
              />,
            )
          }
        >
          {t('button-profile-decrease-reputation')}
        </Button>
      </Stack>
    );
  }

  return <></>;
}
