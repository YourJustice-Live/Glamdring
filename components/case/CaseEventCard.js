import {
  Card,
  CardContent,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_ROLE } from 'constants/contracts';
import { CASE_STAGE_KEY } from 'constants/i18n';
import { useTranslation } from 'next-i18next';

/**
 * A component with a card with case event.
 */
export default function CaseEventCard({ caseEvent }) {
  const { t } = useTranslation('common');

  return (
    <Card elevation={1}>
      <CardContent sx={{ p: 3 }}>
        {/* Account got role */}
        {caseEvent.type === 'accountGotRole' && (
          <Stack direction="row" spacing={1} alignItems="center">
            <ProfileCompactCard
              account={caseEvent.data.account}
              disableRating={true}
            />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {t('text-event-become-a').toLowerCase()}{' '}
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
              {t('text-event-added').toLowerCase()} {caseEvent.data.type}
            </Typography>
          </Stack>
        )}
        {/* Case stage changed */}
        {caseEvent.type === 'stageChanged' && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {t('text-event-case-stange-changed-to')} &quot;
              {t(CASE_STAGE_KEY[caseEvent.data.stage])}
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
              {t('text-event-made-verdict').toLowerCase}
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
              {t('text-event-cancelled-case').toLowerCase()}
            </Typography>
          </Stack>
        )}
        <Divider sx={{ mt: 1, mb: 1 }} />
        {/* Case */}
        <Stack direction="row" spacing={1}>
          <Typography variant="body2">{t('text-case')}:</Typography>
          <Link
            href={`/case/${caseEvent.caseEntity.id}`}
            variant="body2"
            underline="none"
            sx={{ fontWeight: 'bold' }}
          >
            {caseEvent.caseEntity.name}
          </Link>
        </Stack>
        {/* Jurisdiction */}
        <Stack direction="row" spacing={1}>
          <Typography variant="body2">{t('text-jurisdiction')}:</Typography>
          <Link
            href={`/jurisdiction/${caseEvent.caseEntity.jurisdiction?.id}`}
            variant="body2"
            underline="none"
            sx={{ fontWeight: 'bold' }}
          >
            {caseEvent.caseEntity.jurisdiction.name}
          </Link>
        </Stack>
        {/* Created date */}
        <Stack direction="row" spacing={1}>
          <Typography variant="body2">{t('text-date')}:</Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {new Date(caseEvent.createdDate * 1000).toLocaleString()}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
