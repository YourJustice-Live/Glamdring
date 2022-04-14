import {
  AddBoxOutlined,
  IndeterminateCheckBoxOutlined,
  InsertPhotoOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import CaseCreateDialog from 'components/case/CaseCreateDialog';
import {
  REPUTATION_DOMAIN_ID,
  REPUTATION_RATING_ID,
} from 'constants/contracts';
import useDialogContext from 'hooks/useDialogContext';
import useWeb3Context from 'hooks/useWeb3Context';
import NextLink from 'next/link';
import { formatAddress } from 'utils/formatters';
import { getRating } from 'utils/reputation';

/**
 * A component with a card with profile.
 */
export default function ProfileCard({ profile }) {
  const { accountProfile } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();

  return (
    <Card elevation={1}>
      {profile?.account ? (
        <CardContent sx={{ p: '10px !important' }}>
          {/* Image and details */}
          <Stack direction="row" spacing={2} justifyContent="space-between">
            {/* Image */}
            <Box sx={{ mr: 2 }}>
              <Avatar
                sx={{ width: 82, height: 82, borderRadius: '16px' }}
                src={profile.avatarNftUriImage}
              >
                <InsertPhotoOutlined />
              </Avatar>
            </Box>
            {/* Details */}
            <Box sx={{ flex: '1' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography sx={{ mr: 1 }}>Case:</Typography>
                <Typography sx={{ color: 'success.main', mr: 1 }}>
                  +
                  {getRating(
                    profile,
                    REPUTATION_DOMAIN_ID.environment,
                    REPUTATION_RATING_ID.positive,
                  )}
                </Typography>
                <Typography sx={{ color: 'danger.main', mr: 1 }}>
                  -
                  {getRating(
                    profile,
                    REPUTATION_DOMAIN_ID.environment,
                    REPUTATION_RATING_ID.negative,
                  )}
                </Typography>
              </Box>
              <NextLink href={`/profile/${profile.account}`} passHref>
                <Link variant="h5" sx={{ mb: 2 }} underline="none">
                  {profile.avatarNftUriFirstName || 'None'}{' '}
                  {profile.avatarNftUriLastName || 'None'}
                </Link>
              </NextLink>
              <Box>
                <Typography>{formatAddress(profile.account)}</Typography>
              </Box>
            </Box>

            {/* Actions */}
            <Stack
              direction="column"
              spacing={1}
              justifyContent="center"
              sx={{ mr: '10px !important' }}
            >
              <Button
                variant="text"
                color="success"
                size="small"
                startIcon={<AddBoxOutlined />}
                onClick={() =>
                  showDialog(
                    <CaseCreateDialog
                      subjectProfile={profile}
                      affectedProfile={accountProfile}
                      onClose={closeDialog}
                    />,
                  )
                }
              >
                Add Score
              </Button>
              <Button
                variant="text"
                color="danger"
                size="small"
                startIcon={<IndeterminateCheckBoxOutlined />}
                onClick={() =>
                  showDialog(
                    <CaseCreateDialog
                      subjectProfile={profile}
                      affectedProfile={accountProfile}
                      onClose={closeDialog}
                    />,
                  )
                }
              >
                Add Score
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      ) : (
        <CardContent>
          <Skeleton variant="circular" sx={{ mb: 2 }} width={82} height={82} />
          <Skeleton variant="rectangular" height={64} />
        </CardContent>
      )}
    </Card>
  );
}
