import {
  Card,
  CardContent,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_ROLE, CASE_STAGE } from 'constants/contracts';
import { capitalize } from 'lodash';
import { formatAddress } from 'utils/formatters';

/**
 * A component with a card with case event.
 */
export default function CaseEventCard({ caseEvent }) {
  return (
    <Card elevation={1}>
      <CardContent sx={{ p: 3 }}>
        {/* Case address */}
        <Stack direction="row" spacing={1}>
          <Typography variant="body2">Case Address: </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            <Link href={`/case/${caseEvent.caseEntity.id}`} underline="none">
              {formatAddress(caseEvent.caseEntity.id)}
            </Link>
          </Typography>
        </Stack>
        {/* Case name */}
        <Stack direction="row" spacing={1}>
          <Typography variant="body2">Case Name: </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {caseEvent.caseEntity.name}
          </Typography>
        </Stack>
        {/* Created Date */}
        <Stack direction="row" spacing={1}>
          <Typography variant="body2">Event Date: </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {new Date(caseEvent.createdDate * 1000).toLocaleString()}
          </Typography>
        </Stack>
        <Divider sx={{ mt: 1, mb: 2.5 }} />
        {/* Account got role */}
        {caseEvent.type === 'accountGotRole' && (
          <Stack direction="row" spacing={1} alignItems="center">
            <ProfileCompactCard
              account={caseEvent.data.account}
              disableRating={true}
            />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              become a{' '}
              {Object.values(CASE_ROLE).map((role) =>
                role.id === caseEvent.data.role ? role.name : null,
              )}
            </Typography>
          </Stack>
        )}
        {/* Account added post */}
        {caseEvent.type === 'accountAddedPost' && (
          <Stack direction="row" spacing={1} alignItems="center">
            <ProfileCompactCard
              account={caseEvent.data.account}
              disableRating={true}
            />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              added {caseEvent.data.type}
            </Typography>
          </Stack>
        )}
        {/* Case stage changed */}
        {caseEvent.type === 'stageChanged' && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Case stage changed to &quot;
              {Object.values(CASE_STAGE).map((stage) =>
                stage.id.toString() === caseEvent.data.stage
                  ? capitalize(stage.name)
                  : null,
              )}
              &quot;
            </Typography>
          </Stack>
        )}
        {/* Account made verdict */}
        {caseEvent.type === 'accountMadeVerdict' && (
          <Stack direction="row" spacing={1} alignItems="center">
            <ProfileCompactCard
              account={caseEvent.data.account}
              disableRating={true}
            />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              made verdict
            </Typography>
          </Stack>
        )}
        {/* Account cancelled case */}
        {caseEvent.type === 'accountCancelledCase' && (
          <Stack direction="row" spacing={1} alignItems="center">
            <ProfileCompactCard
              account={caseEvent.data.account}
              disableRating={true}
            />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              cancelled case
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
