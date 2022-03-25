import { Grid } from '@mui/material';
import LoadingBackdrop from 'components/extra/LoadingBackdrop';
import useAvatarNftContract from 'hooks/useAvatarNftContract';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import ProfileCard from './ProfileCard';

/**
 * A component with a list of profiles.
 */
export default function ProfileList({ profiles, onUpdateProfiles }) {

  const { enqueueSnackbar } = useSnackbar();
  const { addReputation } = useAvatarNftContract();
  const [isLoading, setIsLoading] = useState(false);
  const defaultProfiles = [{}, {}, {}];

  /**
   * Add positive or negative reputation to the environment domain for specified profile.
   */
  async function addScore(profile, isNegative) {
    try {
      setIsLoading(true);
      const domainId = 0; // Environment domain
      const ratingId = isNegative ? 0 : 1;
      const amount = 1;
      const transaction = await addReputation(profile.avatarNftId, domainId, ratingId, amount);
      await transaction.wait();
      enqueueSnackbar("Success!", { variant: 'success' });
      onUpdateProfiles();
    }
    catch (error) {
      console.error(error);
      enqueueSnackbar(`Oops, error: ${error}`, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Grid container spacing={2}>
      {isLoading && <LoadingBackdrop />}
      {(profiles || defaultProfiles).map((profile, index) =>
        profile && (
          <Grid key={index} item xs={4}>
            <ProfileCard
              profile={profile}
              onAddNegativeScore={(profile) => addScore(profile, true)}
              onAddPositiveScore={(profile) => addScore(profile, false)}
            />
          </Grid>
        )
      )}
    </Grid>
  )
}