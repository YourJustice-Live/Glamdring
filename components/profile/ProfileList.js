import { InsertPhotoOutlined } from '@mui/icons-material';
import { Avatar, Button, Card, CardActions, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import Link from 'next/link';
import { formatAccount } from 'utils/formatters';
import { getTraitValue, traitTypes } from "utils/metadata";

/**
 * A component with a list of profiles.
 */
export default function ProfileList({ profiles }) {

  const defaultProfiles = [{}, {}, {}];

  return (
    <Grid container spacing={2}>
      {(profiles || defaultProfiles).map((profile, index) =>
        profile && (
          <Grid key={index} item xs={4}>
            <Card variant="outlined">
              {profile.account ? (
                <>
                  <CardContent>
                    <Avatar sx={{ width: 82, height: 82, mb: 2 }} src={profile.avatarNftMetadata?.image}>
                      <InsertPhotoOutlined />
                    </Avatar>
                    <Typography variant="h4" sx={{ mb: 2 }}>{getTraitValue(profile.avatarNftMetadata, traitTypes.firstName) || "None"} {getTraitValue(profile.avatarNftMetadata, traitTypes.lastName) || "None"}</Typography>
                    <Typography><b>Account:</b> {formatAccount(profile.account)}</Typography>
                    <Typography><b>Email:</b> {getTraitValue(profile.avatarNftMetadata, traitTypes.email) || "none"}</Typography>
                    <Typography><b>Twitter:</b> {getTraitValue(profile.avatarNftMetadata, traitTypes.twitter) || "none"}</Typography>
                  </CardContent>
                  <CardActions>
                    <Link href={`/profile/${profile.account}`} passHref>
                      <Button size="small">Open Profile</Button>
                    </Link>
                  </CardActions>
                </>
              ) : (
                <CardContent>
                  <Skeleton variant="circular" sx={{ mb: 2 }} width={82} height={82} />
                  <Skeleton variant="rectangular" height={64} />
                </CardContent>
              )}
            </Card>
          </Grid>
        )
      )}
    </Grid>
  )
}