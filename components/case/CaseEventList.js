import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import CaseEventCard from './CaseEventCard';

/**
 * A component with a list of case events.
 */
export default function CaseEventList({ caseEvents, sx }) {
  const { t } = useTranslation('common');

  return (
    <Stack spacing={2} sx={{ ...sx }}>
      {!caseEvents && (
        <>
          {Array(3)
            .fill()
            .map((_, index) => (
              <Card key={index} elevation={1}>
                <CardContent sx={{ p: 3 }}>
                  <Skeleton variant="rectangular" width={196} height={24} />
                  <Skeleton
                    variant="rectangular"
                    width={82}
                    height={24}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            ))}
        </>
      )}
      {caseEvents && caseEvents.length === 0 && (
        <Card elevation={1}>
          <CardContent sx={{ p: 3 }}>
            <Typography>{t('text-no-events')}</Typography>
          </CardContent>
        </Card>
      )}
      {caseEvents && caseEvents.length > 0 && (
        <>
          {caseEvents.map((caseEvent, index) => (
            <CaseEventCard key={index} caseEvent={caseEvent} />
          ))}
        </>
      )}
    </Stack>
  );
}
