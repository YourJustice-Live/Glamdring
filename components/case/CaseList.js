import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import CaseCard from './CaseCard';

/**
 * A component with a list of cases.
 */
export default function CaseList({ cases, sx }) {
  return (
    <Stack spacing={4} sx={{ ...sx }}>
      {!cases && (
        <>
          {Array(3)
            .fill()
            .map((_, index) => (
              <Card key={index} elevation={1}>
                <CardContent sx={{ p: 4 }}>
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
      {cases && cases.length === 0 && (
        <Card elevation={1}>
          <CardContent sx={{ p: 4 }}>
            <Typography>Cases not found :(</Typography>
          </CardContent>
        </Card>
      )}
      {cases && cases.length > 0 && (
        <>
          {cases.map((caseObject, index) => (
            <CaseCard key={index} caseObject={caseObject} />
          ))}
        </>
      )}
    </Stack>
  );
}
