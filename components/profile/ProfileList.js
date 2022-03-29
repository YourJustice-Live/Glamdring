import { Grid, Typography } from '@mui/material';
import ProfileCard from 'components/profile/ProfileCard';

/**
 * A component with a list of profiles.
 */
export default function ProfileList({ profiles }) {

  return (
    <Grid container spacing={2}>
      {!profiles && (
        <>
          {[{}, {}, {}].map((_, index) =>
            <Grid key={index} item xs={12} md={4}>
              <ProfileCard />
            </Grid>
          )}
        </>
      )}
      {profiles && profiles.length > 0 && (
        <>
          {(profiles).map((profile, index) =>
            profile && (
              <Grid key={index} item xs={12} md={4}>
                <ProfileCard profile={profile} />
              </Grid>
            )
          )}
        </>
      )}
      {profiles && profiles.length === 0 && (
        <Grid item xs={12} md={4}>
          <Typography>None</Typography>
        </Grid>
      )}
    </Grid>
  )
}