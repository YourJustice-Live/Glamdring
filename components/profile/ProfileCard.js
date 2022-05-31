import {
  AddBoxOutlined,
  IndeterminateCheckBoxOutlined,
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
import useDataContext from 'hooks/context/useDataContext';
import useDialogContext from 'hooks/context/useDialogContext';
import { IconMember } from 'icons/entities';
import NextLink from 'next/link';
import { formatAddress } from 'utils/formatters';

/**
 * A component with a card with profile.
 */
export default function ProfileCard({ profile, jurisdiction }) {
  const { accountProfile } = useDataContext();
  const { showDialog, closeDialog } = useDialogContext();

  return (
    <Card elevation={1}>
      {profile?.owner ? (
        <CardContent sx={{ p: '10px !important' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: { xs: 'flex-start', md: 'space-between' },
            }}
          >
            {/* Image and details */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {/* Image */}
              <Box sx={{ mr: 2 }}>
                <NextLink href={`/profile/${profile.owner}`} passHref>
                  <Avatar
                    sx={{
                      cursor: 'pointer',
                      width: 82,
                      height: 82,
                      borderRadius: '16px',
                    }}
                    src={profile.uriImage}
                  >
                    <IconMember width="82" heigth="82" />
                  </Avatar>
                </NextLink>
              </Box>
              {/* Details */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <Typography sx={{ color: 'success.main', mr: 1 }}>
                    {`+${profile.totalPositiveRating}`}
                  </Typography>
                  <Typography sx={{ color: 'danger.main', mr: 1 }}>
                    {`-${profile.totalNegativeRating}`}
                  </Typography>
                </Box>
                <NextLink href={`/profile/${profile.owner}`} passHref>
                  <Link variant="h5" underline="none">
                    {profile.uriFirstName || 'Anonymous'} {profile.uriLastName}
                  </Link>
                </NextLink>
                <Typography variant="body2" color="text.secondary">
                  {formatAddress(profile.owner)}
                </Typography>
              </Box>
            </Box>
            {/* Actions */}
            <Stack
              direction={{ xs: 'row', md: 'column' }}
              spacing={1}
              justifyContent="center"
              sx={{ mr: '10px !important', mt: { xs: 2, md: 0 } }}
            >
              <Button
                variant="text"
                color="success"
                size="small"
                startIcon={<AddBoxOutlined />}
                sx={{ flex: { xs: 1, md: 0 } }}
                onClick={() =>
                  showDialog(
                    <CaseCreateDialog
                      jurisdiction={jurisdiction}
                      subjectProfile={profile}
                      affectedProfile={accountProfile}
                      onClose={closeDialog}
                    />,
                  )
                }
              >
                Add Reputation
              </Button>
              <Button
                variant="text"
                color="danger"
                size="small"
                startIcon={<IndeterminateCheckBoxOutlined />}
                sx={{ flex: { xs: 1, md: 0 } }}
                onClick={() =>
                  showDialog(
                    <CaseCreateDialog
                      jurisdiction={jurisdiction}
                      subjectProfile={profile}
                      affectedProfile={accountProfile}
                      onClose={closeDialog}
                    />,
                  )
                }
              >
                Add Reputation
              </Button>
            </Stack>
          </Box>
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
