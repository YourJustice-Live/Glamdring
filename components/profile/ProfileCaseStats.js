import { Divider, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { palette } from 'theme/palette';

/**
 * A component with profile case stats.
 */
export default function ProfileCaseStats({ profile, sx }) {
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
        <Stats value={totalCases} title="CASES" />
        <Stats
          value={profile.avatarNftTotalPositiveCases}
          title="POSITIVE"
          titleColor={palette.success.main}
        />
        <Stats
          value={profile.avatarNftTotalNegativeCases}
          title="NEGATIVE"
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
