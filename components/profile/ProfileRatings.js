import {
  AddBoxOutlined,
  IndeterminateCheckBoxOutlined,
} from '@mui/icons-material';
import {
  Button,
  Divider,
  LinearProgress,
  Link,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import CaseCreateDialog from 'components/case/CaseCreateDialog';
import useDialogContext from 'hooks/useDialogContext';
import useWeb3Context from 'hooks/useWeb3Context';
import { capitalize } from 'lodash';

/**
 * A component with profile ratings.
 *
 * TODO: Automatically open a dialog for creating a case with negative laws if the user clicks the red button "Add Score"
 */
export default function ProfileRatings({ profile, sx }) {
  const { accountProfile } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();

  return (
    <Box sx={{ ...sx }}>
      {profile ? (
        <>
          {/* Ratings */}
          <Paper variant="outlined" sx={{ p: 4, mt: 2 }}>
            <Typography variant="h2" gutterBottom>
              Reputations
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Total Rating */}
            <Rating
              domain="Total Reputation"
              negativeRating={profile.avatarNftTotalNegativeRating}
              positiveRating={profile.avatarNftTotalPositiveRating}
              sx={{ mt: 4 }}
            />
            {/* Rating by domains */}
            {profile.avatarNftReputations?.map((reputation, index) => (
              <Rating
                key={index}
                domain={capitalize(reputation.domain)}
                jurisdiction={reputation.jurisdiction.id}
                negativeRating={reputation.negativeRating}
                positiveRating={reputation.positiveRating}
                sx={{ mt: 4 }}
              />
            ))}
          </Paper>
          {/* Actions */}
          <Box sx={{ display: 'flex', mt: 2 }}>
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
        </>
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
            width={256}
            sx={{ mb: 1 }}
          />
        </>
      )}
    </Box>
  );
}

function Rating({ domain, jurisdiction, negativeRating, positiveRating, sx }) {
  const negativePercent =
    (100 * Number(negativeRating)) /
    (Number(positiveRating) + Number(negativeRating));
  const positivePercent =
    (100 * Number(positiveRating)) /
    (Number(positiveRating) + Number(negativeRating));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...sx,
      }}
    >
      <Box sx={{ minWidth: 100, mr: 2 }}>
        <Typography>{domain}</Typography>
        {jurisdiction && (
          <Typography variant="body2">
            <Link href={`/jurisdiction/${jurisdiction}`} underline="none">
              Jurisdiction
            </Link>
          </Typography>
        )}
      </Box>
      <Box sx={{ flex: 1 }}>
        <RatingBar
          value={positivePercent}
          text={positiveRating}
          color="success"
        />
        <RatingBar
          value={negativePercent}
          text={negativeRating}
          color="danger"
        />
      </Box>
    </Box>
  );
}

function RatingBar({ value, text, color }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <LinearProgress
        variant="determinate"
        value={value}
        color={color}
        sx={{ flex: 1, height: 18, borderRadius: '12px', mr: 1 }}
      />
      <Typography>{text}</Typography>
    </Box>
  );
}
