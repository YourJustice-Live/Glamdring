import {
  AddBoxOutlined,
  IndeterminateCheckBoxOutlined,
  PersonOutlined,
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
import useDialogContext from 'hooks/useDialogContext';
import useWeb3Context from 'hooks/useWeb3Context';
import NextLink from 'next/link';
import { formatAddress } from 'utils/formatters';

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
                <PersonOutlined />
              </Avatar>
            </Box>
            {/* Details */}
            <Box sx={{ flex: '1' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography sx={{ color: 'success.main', mr: 1 }}>
                  {`+${profile.avatarNftTotalPositiveRating}`}
                </Typography>
                <Typography sx={{ color: 'danger.main', mr: 1 }}>
                  {`-${profile.avatarNftTotalNegativeRating}`}
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
          <Stack direction="row" spacing={2}>
            <Skeleton
              variant="circular"
              width={82}
              height={82}
              sx={{ borderRadius: '16px' }}
            />
            <Box>
              <Skeleton variant="rectangular" width={164} height={24} />
              <Skeleton
                variant="rectangular"
                width={82}
                height={16}
                sx={{ mt: 1 }}
              />
            </Box>
          </Stack>
        </CardContent>
      )}
    </Card>
  );
}
