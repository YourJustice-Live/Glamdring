import { AddBoxOutlined, IndeterminateCheckBoxOutlined, InsertPhotoOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CardContent, Divider, Skeleton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { formatAccount } from 'utils/formatters';
import { getTraitValue, traitTypes } from "utils/metadata";
import { domainIds, getRating, ratingIds } from 'utils/reputation';

/**
 * A component with a card with profile.
 */
export default function ProfileCard({ profile, onAddPositiveScore, onAddNegativeScore }) {

  return (
    <Card variant="outlined">
      {profile?.account ? (
        <>
          <CardContent>
            <Avatar sx={{ width: 82, height: 82, mb: 2 }} src={profile.avatarNftMetadata?.image}>
              <InsertPhotoOutlined />
            </Avatar>
            <Typography variant="h4" sx={{ mb: 2 }}>{getTraitValue(profile.avatarNftMetadata, traitTypes.firstName) || "None"} {getTraitValue(profile.avatarNftMetadata, traitTypes.lastName) || "None"}</Typography>
            <Typography><b>Account:</b> {formatAccount(profile.account)}</Typography>
            <Typography><b>Email:</b> {getTraitValue(profile.avatarNftMetadata, traitTypes.email) || "none"}</Typography>
            <Typography><b>Twitter:</b> {getTraitValue(profile.avatarNftMetadata, traitTypes.twitter) || "none"}</Typography>
            <Box>
              <Box sx={{ fontWeight: 'bold', display: 'inline', mr: 1 }}>Reputation:</Box>
              <Box sx={{ color: 'success.main', display: 'inline', mr: 1 }}>+{getRating(profile, domainIds.environment, ratingIds.positive)}</Box>
              <Box sx={{ color: 'danger.main', display: 'inline' }}>-{getRating(profile, domainIds.environment, ratingIds.negative)}</Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Stack direction='row' spacing={1}>
              <Button variant="contained" color="success" size="small" startIcon={<AddBoxOutlined />} onClick={() => onAddPositiveScore(profile)}>Add Score</Button>
              <Button variant="contained" color="danger" size="small" startIcon={<IndeterminateCheckBoxOutlined />} onClick={() => onAddNegativeScore(profile)}>Add Score</Button>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Link href={`/profile/${profile.account}`} passHref>
              <Button size="small">Open Profile</Button>
            </Link>
          </CardContent>
        </>
      ) : (
        <CardContent>
          <Skeleton variant="circular" sx={{ mb: 2 }} width={82} height={82} />
          <Skeleton variant="rectangular" height={64} />
        </CardContent>
      )}
    </Card>
  )
}