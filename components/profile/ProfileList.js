import { Grid, Typography } from '@mui/material';
import ProfileCard from 'components/profile/ProfileCard';
import { useTranslation } from 'next-i18next';

/**
 * A component with a list of profiles.
 */
export default function ProfileList({ profiles, jurisdiction, sx }) {
  const { t } = useTranslation('common');

  return (
    <Grid container spacing={3} sx={{ ...sx }}>
      {!profiles && (
        <>
          {Array(3)
            .fill()
            .map((_, index) => (
              <Grid key={index} item xs={12}>
                <ProfileCard />
              </Grid>
            ))}
        </>
      )}
      {profiles && profiles.length === 0 && (
        <Grid item xs={12}>
          <Typography>{t('text-profiles-no')}</Typography>
        </Grid>
      )}
      {profiles && profiles.length > 0 && (
        <>
          {profiles.map(
            (profile, index) =>
              profile && (
                <Grid key={index} item xs={12}>
                  <ProfileCard profile={profile} jurisdiction={jurisdiction} />
                </Grid>
              ),
          )}
        </>
      )}
    </Grid>
  );
}
