import { InsertPhotoOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CardActions, CardContent, Divider, Grid, Skeleton, Typography } from '@mui/material';
import useProfile from 'hooks/useProfile';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { formatAccount } from 'utils/formatters';

/**
 * A component with a list of profiles.
 */
export default function ProfileList() {

  const { enqueueSnackbar } = useSnackbar();
  const { getProfiles } = useProfile();
  const [profiles, setProfiles] = useState([{}, {}, {}]);

  async function loadData() {
    try {
      setProfiles(await getProfiles());
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Oops, error: ${error}`, { variant: 'error' });
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      <Typography variant='h4' gutterBottom>Profiles</Typography>
      <Divider sx={{ marginBottom: '1.5rem' }} />
      <Grid container spacing={2}>
        {profiles.map((profile, index) =>
          profile ? (
            <Grid key={index} item xs={4}>
              <Card variant="outlined">
                {profile.account ? (
                  <>
                    <CardContent>
                      <Avatar sx={{ width: 82, height: 82, marginBottom: '1rem' }} src={profile.avatarNftMetadata?.profilePicture}>
                        <InsertPhotoOutlined />
                      </Avatar>
                      <Typography variant="h4" sx={{ marginBottom: '1rem' }}>{profile.avatarNftMetadata?.publicProfile?.firstName || "None"} {profile.avatarNftMetadata?.publicProfile?.lastName || "None"}</Typography>
                      <Typography><b>Account:</b> {formatAccount(profile.account)}</Typography>
                      <Typography><b>Email:</b> {profile.avatarNftMetadata?.publicContacts?.email || "none"}</Typography>
                      <Typography><b>Twitter:</b> {profile.avatarNftMetadata?.links?.twitter || "none"}</Typography>
                    </CardContent>
                    <CardActions>
                      <Link href={`/profile/${profile.account}`} passHref>
                        <Button size="small">Open Profile</Button>
                      </Link>
                    </CardActions>
                  </>
                ) : (
                  <CardContent>
                    <Skeleton variant="circular" sx={{ marginBottom: '1rem' }} width={82} height={82} />
                    <Skeleton variant="rectangular" height={64} />
                  </CardContent>
                )}
              </Card>
            </Grid>
          ) : (
            <></>
          )
        )}
      </Grid>
    </Box>
  )
}