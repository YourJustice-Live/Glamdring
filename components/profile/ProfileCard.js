import { AddBoxOutlined, IndeterminateCheckBoxOutlined, InsertPhotoOutlined, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Button, Card, CardContent, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { DEFAULT_ADD_REPUTATION_AMOUNT, REPUTATION_DOMAIN_ID, REPUTATION_RATING_ID } from 'constants/contracts';
import useAvatarNftContract from 'hooks/useAvatarNftContract';
import useToasts from 'hooks/useToasts';
import Link from 'next/link';
import { useState } from 'react';
import { formatAccount } from 'utils/formatters';
import { getTraitValue, traitTypes } from "utils/metadata";
import { getRating } from 'utils/reputation';

/**
 * A component with a card with profile.
 */
export default function ProfileCard({ profile }) {

  const { showToastSuccess, showToastError } = useToasts();
  const { addReputation } = useAvatarNftContract();
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Add positive or negative reputation (score) to the environment domain for specified profile.
   */
  async function addScore(isNegative) {
    try {
      setIsProcessing(true);
      await addReputation(
        profile.avatarNftId,
        REPUTATION_DOMAIN_ID.environment,
        isNegative ? REPUTATION_RATING_ID.negative : REPUTATION_RATING_ID.positive,
        DEFAULT_ADD_REPUTATION_AMOUNT
      );
      showToastSuccess("Success! Reputation of this profile will be updated soon.");
    }
    catch (error) {
      showToastError(error);
    } finally {
      setIsProcessing(false);
    }
  }

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
              <Box sx={{ color: 'success.main', display: 'inline', mr: 1 }}>+{getRating(profile, REPUTATION_DOMAIN_ID.environment, REPUTATION_RATING_ID.positive)}</Box>
              <Box sx={{ color: 'danger.main', display: 'inline' }}>-{getRating(profile, REPUTATION_DOMAIN_ID.environment, REPUTATION_RATING_ID.negative)}</Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Stack direction='row' spacing={1} sx={{ height: 36 }}>
              {isProcessing ? (
                <LoadingButton loading loadingPosition="start" startIcon={<Save />} variant="outlined">Processing</LoadingButton>
              ) : (
                <>
                  <Button variant="contained" color="success" size="small" startIcon={<AddBoxOutlined />} onClick={() => addScore(false)}>Add Score</Button>
                  <Button variant="contained" color="danger" size="small" startIcon={<IndeterminateCheckBoxOutlined />} onClick={() => addScore(true)}>Add Score</Button>
                </>
              )}
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
      )
      }
    </Card >
  )
}