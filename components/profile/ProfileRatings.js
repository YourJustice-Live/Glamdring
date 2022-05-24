import {
  AddBoxOutlined,
  IndeterminateCheckBoxOutlined,
} from '@mui/icons-material';
import {
  Button,
  LinearProgress,
  Link,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import CaseCreateDialog from 'components/case/CaseCreateDialog';
import useDataContext from 'hooks/context/useDataContext';
import useDialogContext from 'hooks/context/useDialogContext';
import { capitalize } from 'lodash';
import { palette } from 'theme/palette';

/**
 * A component with profile ratings.
 *
 * TODO: Automatically open a dialog for creating a case with negative laws if the user clicks the red button "Add Score"
 */
export default function ProfileRatings({ profile, sx }) {
  const { accountProfile } = useDataContext();
  const { showDialog, closeDialog } = useDialogContext();

  return (
    <Box sx={{ ...sx }}>
      {profile ? (
        <Paper sx={{ p: 3 }}>
          {/* Total Rating */}
          <Rating
            domain="Total Reputation"
            negativeRating={profile.avatarNftTotalNegativeRating}
            positiveRating={profile.avatarNftTotalPositiveRating}
          />
          {/* Rating by domains */}
          {profile.avatarNftReputations?.map((reputation, index) => (
            <Rating
              key={index}
              domain={capitalize(reputation.domain)}
              jurisdiction={reputation.jurisdiction}
              negativeRating={reputation.negativeRating}
              positiveRating={reputation.positiveRating}
              totalNegativeRating={profile.avatarNftTotalNegativeRating}
              totalPositiveRating={profile.avatarNftTotalPositiveRating}
              sx={{ mt: 2 }}
            />
          ))}
          {/* Actions */}
          <Box sx={{ display: 'flex', mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddBoxOutlined />}
              sx={{ flex: 1, mr: 1 }}
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
              Add Reputation
            </Button>
            <Button
              variant="contained"
              color="danger"
              startIcon={<IndeterminateCheckBoxOutlined />}
              sx={{ flex: 1 }}
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
              Add Reputation
            </Button>
          </Box>
        </Paper>
      ) : (
        <>
          <Skeleton
            variant="rectangular"
            height={24}
            width={256}
            sx={{ mb: 1 }}
          />
          <Skeleton
            variant="rectangular"
            height={24}
            width={164}
            sx={{ mb: 1 }}
          />
        </>
      )}
    </Box>
  );
}

function Rating({
  domain,
  jurisdiction,
  negativeRating = 0,
  positiveRating = 0,
  totalNegativeRating = 0,
  totalPositiveRating = 0,
  sx,
}) {
  const sumRating = Number(negativeRating) + Number(positiveRating);
  const sumTotalRating =
    Number(totalNegativeRating) + Number(totalPositiveRating);
  const negativePercent = (100 * Number(negativeRating)) / sumRating;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      {/* Domain and jurisdiction */}
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {jurisdiction ? (
          <>
            <Typography variant="body2">{domain}</Typography>
            <Typography variant="body2">
              (
              <Link href={`/jurisdiction/${jurisdiction.id}`} underline="none">
                {jurisdiction.name}
              </Link>
              )
            </Typography>
          </>
        ) : (
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {domain}
          </Typography>
        )}
      </Stack>
      {/* Rating bar */}
      <Box sx={{ mt: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: sumRating / sumTotalRating,
            minWidth: 0.1,
          }}
        >
          <Typography
            color="danger.main"
            sx={{ fontWeight: 'bold', minWidth: 24 }}
          >
            -{negativeRating}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={negativePercent}
            sx={{
              flex: 1,
              height: 18,
              borderRadius: '6px',
              ml: 1,
              mr: 1,
              '&.MuiLinearProgress-colorPrimary': {
                background: palette.success.main,
              },
              '& .MuiLinearProgress-barColorPrimary': {
                background: palette.danger.main,
              },
            }}
          />
          <Typography
            color="success.main"
            sx={{ fontWeight: 'bold', minWidth: 24 }}
          >
            +{positiveRating}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
