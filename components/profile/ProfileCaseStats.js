import { Divider, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { palette } from 'theme/palette';

/**
 * A component with profile case stats.
 */
export default function ProfileCaseStats({ profile, sx }) {
  const { t } = useTranslation('common');

  if (profile) {
    const totalCases =
      Number(profile.avatarNftTotalPositiveCases) +
      Number(profile.avatarNftTotalNegativeCases);
    return (
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-between"
        spacing={2}
        sx={{ px: 4, ...sx }}
      >
        <Stats
          value={totalCases}
          title={t('text-profile-cases').toUpperCase()}
        />
        <Stats
          value={profile.avatarNftTotalPositiveCases}
          title={t('text-profile-positive-cases').toUpperCase()}
          titleColor={palette.success.main}
        />
        <Stats
          value={profile.avatarNftTotalNegativeCases}
          title={t('text-profile-negative-cases').toUpperCase()}
          titleColor={palette.danger.main}
        />
      </Stack>
    );
  }

  return <></>;
}

function Stats({ value, title, titleColor }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '20%',
      }}
    >
      <Typography variant="h4" sx={{ mb: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: titleColor }}>
        {title}
      </Typography>
    </Box>
  );
}
